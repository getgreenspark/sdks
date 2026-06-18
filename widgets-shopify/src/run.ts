import { createCartApi } from './cart'
import { getGreensparkApiUrl } from './config'
import { getWidgetContainer, injectWidgetStyles, movePopupToBody } from './dom'
import { err, warn } from './debug'
import { EnumToWidgetTypeMap, type RunContext, type WidgetVariant } from './interfaces'
import { CART_DRAWER_SELECTORS, TARGET_SELECTOR } from './selectors'
import { setup } from './script-loader'
import { renderWidget } from './widgets'

const MAX_RETRIES = 5
const RENDER_DEBOUNCE_MS = 150
const CART_RERENDER_DELAY_MS = 300
const CART_API_PATTERN = /\/cart\/(add|update|change|clear)(\.js)?$/

let retryCount = 0
let scheduledRenderTimer: number | null = null
let cartDrawerRetryCount = 0
let cartDrawerObserverInitialized = false
let cartDrawerDebounceTimer: number | null = null
let pendingTargets: HTMLElement[] | null = null

export function getWidgetVariant(target: Element): WidgetVariant | undefined {
  let type: string
  try {
    ;[type] = atob(target.id).split('|')
  } catch (error: unknown) {
    err('run: invalid widget ID encoding:', target.id, error)
    return undefined
  }

  const variant = EnumToWidgetTypeMap[type]
  if (!variant) {
    err('run: unknown widget type', type, 'for target', target.id)
  }
  return variant
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

function setupCartDrawerObserver(): void {
  if (cartDrawerObserverInitialized) return

  const drawerEl = document.querySelector(CART_DRAWER_SELECTORS.join(', '))
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
          const targets = drawerEl.querySelectorAll<HTMLElement>(TARGET_SELECTOR)
          const hasMissingWidget = [...targets].some(
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

export function runGreenspark(targets?: Iterable<Element>): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => runGreenspark(targets), { once: true })
    return
  }

  setupCartDrawerObserver()
  interceptCartMutations()

  if (!window.GreensparkWidgets) {
    if (retryCount++ >= MAX_RETRIES) {
      err('run: GreensparkWidgets not available after max retries')
      return
    }
    window.setTimeout(() => runGreenspark(targets), 50)
    return
  }

  retryCount = 0

  const shopUniqueName = window.Shopify?.shop
  if (!shopUniqueName) {
    err('run: missing Shopify shop context')
    return
  }

  const targetsToRender = getTargets(targets)
  if (targetsToRender.length === 0) return

  const useShadowDom = false
  const version = 'v2' as const
  const currency = window.Shopify?.currency?.active ?? ''
  const productId = String(window.ShopifyAnalytics?.meta?.product?.id ?? '')
  const locale = window.Shopify?.locale ?? 'en'
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

  targetsToRender.forEach((target) => {
    const variant = getWidgetVariant(target)
    if (!variant) return

    const containerSelector = getWidgetContainer(target.id)
    renderWidget(ctx, variant, target.id, containerSelector)
  })
}
