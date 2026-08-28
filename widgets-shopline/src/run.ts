import { createCartApi } from './cart'
import { getCapturedWidgetId, getGreensparkApiUrl, getLocale, getProductIdFromPage, getShopUniqueName } from './config'
import { getWidgetContainer, injectWidgetStyles, movePopupToBody } from './dom'
import { err, warn } from './debug'
import { EnumToWidgetTypeMap, type RunContext, type WidgetVariant } from './interfaces'
import { CART_DRAWER_INJECT_ANCHORS, CART_DRAWER_SELECTORS, TARGET_SELECTOR } from './selectors'
import { setup } from './script-loader'
import { renderWidget } from './widgets'

const MAX_RETRIES = 5
const RENDER_DEBOUNCE_MS = 150
const CART_RERENDER_DELAY_MS = 300
const CART_API_PATTERN = /\/(cart\/(add|update|change|clear)|api\/cart\/change|ajax-cart\/update)(\.js)?$/

let retryCount = 0
let scheduledRenderTimer: number | null = null
let cartDrawerRetryCount = 0
let cartDrawerObserverInitialized = false
let cartDrawerDebounceTimer: number | null = null
let pendingTargets: HTMLElement[] | null = null

export function resolveWidgetId(target: HTMLElement): string {
  return target.getAttribute('data-gs-widget-id') || target.id
}

export function getWidgetVariant(widgetId: string): WidgetVariant | undefined {
  const variant = tryParseWidgetVariant(widgetId)
  if (!variant) {
    err('run: unknown or invalid widget id', widgetId)
  }
  return variant
}

function tryParseWidgetVariant(widgetId: string): WidgetVariant | undefined {
  try {
    const [type] = atob(widgetId).split('|')
    return EnumToWidgetTypeMap[type]
  } catch {
    return undefined
  }
}

function mergePendingTargets(targets?: Iterable<Element>): void {
  if (!targets) {
    pendingTargets = null
    return
  }

  const next = pendingTargets === null ? [] : [...pendingTargets]
  for (const target of targets) {
    if (!(target instanceof HTMLElement)) continue
    if (!next.includes(target)) next.push(target)
  }
  pendingTargets = next
}

export function scheduleRun(targets?: Iterable<Element>): void {
  mergePendingTargets(targets)

  if (scheduledRenderTimer) window.clearTimeout(scheduledRenderTimer)
  scheduledRenderTimer = window.setTimeout(() => {
    const targetsToRender = pendingTargets?.length ? [...pendingTargets] : undefined
    pendingTargets = []
    scheduledRenderTimer = null

    setup()
      .then(() => runGreenspark(targetsToRender))
      .catch((error: unknown) => err('run: scheduled setup failed', error))
  }, RENDER_DEBOUNCE_MS)
}

function getTargets(targets?: Iterable<Element>): HTMLElement[] {
  if (targets) {
    return [...targets].filter((target): target is HTMLElement => target instanceof HTMLElement)
  }

  return [...document.querySelectorAll<HTMLElement>(TARGET_SELECTOR)]
}

function findDrawerEl(): Element | null {
  return document.querySelector(CART_DRAWER_SELECTORS.join(', '))
}

function findFirstOrderImpactsWidgetId(): string | undefined {
  for (const el of document.querySelectorAll<HTMLElement>(TARGET_SELECTOR)) {
    const widgetId = resolveWidgetId(el)
    if (widgetId && tryParseWidgetVariant(widgetId) === 'orderImpacts') return widgetId
  }
  return undefined
}

function configuredDrawerWidgetId(): string | undefined {
  return getCapturedWidgetId() || findFirstOrderImpactsWidgetId()
}

/** App blocks cannot land in the OS 3.0 drawer; inject a *ById target when configured. */
export function ensureDrawerTarget(): HTMLElement | null {
  const widgetId = configuredDrawerWidgetId()
  if (!widgetId) return null

  const drawer = findDrawerEl()
  if (!drawer) return null

  const existingInDrawer = [...drawer.querySelectorAll<HTMLElement>(TARGET_SELECTOR)].find(
    (el) => resolveWidgetId(el) === widgetId,
  )
  if (existingInDrawer) return existingInDrawer

  const el = document.createElement('div')
  el.className = 'greenspark-widget-target'
  el.setAttribute('data-gs-widget-id', widgetId)
  el.id = document.getElementById(widgetId)
    ? `${widgetId.replace(/[^a-z0-9_-]/gi, '-')}--drawer`
    : widgetId

  const anchor = drawer.querySelector(CART_DRAWER_INJECT_ANCHORS.join(', '))
  if (anchor?.parentElement) {
    anchor.parentElement.insertBefore(el, anchor)
  } else {
    drawer.appendChild(el)
  }

  return el
}

function setupCartDrawerObserver(): void {
  if (cartDrawerObserverInitialized) return

  const drawerEl = findDrawerEl()
  if (!drawerEl) {
    if (cartDrawerRetryCount++ >= MAX_RETRIES) {
      cartDrawerObserverInitialized = true
      warn('run: cart drawer not found after max retries; stopping observer setup')
      return
    }
    window.setTimeout(() => {
      if (!cartDrawerObserverInitialized) setupCartDrawerObserver()
    }, 400)
    return
  }

  try {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue
        if (cartDrawerDebounceTimer) window.clearTimeout(cartDrawerDebounceTimer)

        cartDrawerDebounceTimer = window.setTimeout(() => {
          const injected = ensureDrawerTarget()
          const targets = [...drawerEl.querySelectorAll<HTMLElement>(TARGET_SELECTOR)]
          if (injected && !targets.includes(injected)) targets.push(injected)
          const hasMissingWidget = targets.some(
            (target) => !target.querySelector('.greenspark-widget-instance'),
          )
          if (hasMissingWidget) scheduleRun(targets)
        }, 120)
        break
      }
    })

    observer.observe(drawerEl, { childList: true, subtree: true })
    cartDrawerObserverInitialized = true
    cartDrawerRetryCount = 0
  } catch (error: unknown) {
    err('run: failed to attach cart drawer observer', error)
  }
}

function interceptCartMutations(): void {
  if (window._greensparkFetchIntercepted || typeof window.fetch !== 'function') return
  window._greensparkFetchIntercepted = true

  const originalFetch = window.fetch
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const response = originalFetch.call(this, input, init)
    const url = getFetchUrl(input)

    if (!url || !CART_API_PATTERN.test(url.pathname)) {
      return response
    }

    response
      .then((res) => {
        if (res.ok) {
          window.setTimeout(() => {
            ensureDrawerTarget()
            scheduleRun()
          }, CART_RERENDER_DELAY_MS)
        }
      })
      .catch(() => {
        // Ignore failed cart mutations here; the original fetch promise remains unchanged.
      })

    return response
  }
}

function getFetchUrl(input: RequestInfo | URL): URL | null {
  try {
    if (input instanceof URL) return input
    if (input instanceof Request) return new URL(input.url, window.location.origin)
    return new URL(input, window.location.origin)
  } catch {
    return null
  }
}

let themeEventRetryCount = 0

function listenThemeEvents(): void {
  if (window._greensparkThemeEventsBound) return
  const center = window.themeEventCenter
  if (!center) {
    if (themeEventRetryCount++ >= MAX_RETRIES) return
    window.setTimeout(listenThemeEvents, 400)
    return
  }

  const onCartChanged = (): void => {
    ensureDrawerTarget()
    scheduleRun()
  }

  const subscribe = center.addListener?.bind(center) ?? center.addEventListener?.bind(center)
  if (!subscribe) return

  window._greensparkThemeEventsBound = true
  subscribe('variant:added', onCartChanged)
  subscribe('cart:opened', onCartChanged)
}

export function runGreenspark(targets?: Iterable<Element>): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => runGreenspark(targets), { once: true })
    return
  }

  setupCartDrawerObserver()
  interceptCartMutations()
  listenThemeEvents()
  ensureDrawerTarget()

  if (!window.GreensparkWidgets) {
    if (retryCount++ >= MAX_RETRIES) {
      err('run: GreensparkWidgets not available after max retries')
      return
    }
    window.setTimeout(() => runGreenspark(targets), 50)
    return
  }

  retryCount = 0

  const shopUniqueName = getShopUniqueName()
  if (!shopUniqueName) {
    err('run: missing SHOPLINE shop context')
    return
  }

  const targetsToRender = getTargets(targets)
  if (targetsToRender.length === 0) return

  const useShadowDom = false
  const version = 'v2' as const
  const currency = ''
  const productId = getProductIdFromPage()
  const locale = getLocale()
  const greenspark = new window.GreensparkWidgets({
    locale,
    integrationSlug: shopUniqueName,
    isShopifyIntegration: true,
    apiUrl: getGreensparkApiUrl(shopUniqueName),
  })

  const ctx: RunContext = {
    greenspark,
    cartApi: createCartApi(shopUniqueName),
    getWidgetContainer,
    movePopupToBody,
    productId,
    currency,
    useShadowDom,
    version,
  }

  injectWidgetStyles()

  const cartApi = ctx.cartApi
  cartApi
    .getOrder()
    .then((order) => {
      ctx.currency = order.currency || ctx.currency
      targetsToRender.forEach((target) => {
        const widgetId = resolveWidgetId(target)
        const variant = getWidgetVariant(widgetId)
        if (!variant) return

        const containerSelector = getWidgetContainer(target)
        renderWidget(ctx, variant, widgetId, containerSelector)
      })
    })
    .catch((error: unknown) => {
      err('run: getOrder failed; rendering without cart currency', error)
      targetsToRender.forEach((target) => {
        const widgetId = resolveWidgetId(target)
        const variant = getWidgetVariant(widgetId)
        if (!variant) return

        const containerSelector = getWidgetContainer(target)
        renderWidget(ctx, variant, widgetId, containerSelector)
      })
    })
}
