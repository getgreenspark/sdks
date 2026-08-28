import { createCartApi } from './cart'
import {
  getGreensparkApiUrl,
  getLocale,
  getProductIdFromPage,
  getShopUniqueName,
  getWidgetsClientSlug,
  parseCurrency,
  stampedCurrency,
} from './config'
import { clearWidgetMount, getWidgetContainer, injectWidgetStyles, movePopupToBody } from './dom'
import { err } from './debug'
import { EnumToWidgetTypeMap, type RunContext, type WidgetVariant } from './interfaces'
import { TARGET_SELECTOR } from './selectors'
import { setup } from './script-loader'
import { renderWidget } from './widgets'

const MAX_RETRIES = 5
const RENDER_DEBOUNCE_MS = 150

/**
 * Theme `routes.cart_*_url` plus Ajax `POST /api/cart/change`.
 * A default Accept header 302s to `/cart` — match the request URL, not only res.url.
 */
const CART_MUTATION_PATH =
  /\/(cart\/(add|update|change|clear)|api\/cart\/change|ajax-cart\/update)(\.js)?$/

let retryCount = 0
let scheduledRenderTimer: number | null = null
let pendingTargets: HTMLElement[] | null = null
let themeEventRetryCount = 0

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

function getFetchUrl(input: RequestInfo | URL): URL | null {
  try {
    if (input instanceof URL) return input
    if (input instanceof Request) return new URL(input.url, window.location.origin)
    return new URL(input, window.location.origin)
  } catch {
    return null
  }
}

function isCartMutationUrl(input: RequestInfo | URL | undefined): boolean {
  if (input == null || input === '') return false
  const parsed = getFetchUrl(input)
  return parsed != null && CART_MUTATION_PATH.test(parsed.pathname)
}

function onCartRefresh(): void {
  scheduleRun()
}

function interceptCartMutations(): void {
  if (!window._greensparkCartRefreshBound) {
    window._greensparkCartRefreshBound = true
    window.addEventListener('greenspark-cart-refresh', onCartRefresh)
  }

  // CLI uses the same flag; skip wrapping if the theme extension already did.
  if (window._greensparkCartFetchWrapped || typeof window.fetch !== 'function') return
  window._greensparkCartFetchWrapped = true

  const originalFetch = window.fetch.bind(window)
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const response = originalFetch(input, init)
    void response
      .then((res) => {
        if (isCartMutationUrl(input) || isCartMutationUrl(res.url)) {
          window.dispatchEvent(new Event('greenspark-cart-refresh'))
        }
      })
      .catch(() => {
        // Observer only; the caller still handles the original fetch promise.
      })
    return response
  }
}

function listenThemeEvents(): void {
  if (window._greensparkThemeEventsBound) return
  const center = window.themeEventCenter
  if (!center) {
    if (themeEventRetryCount++ >= MAX_RETRIES) return
    window.setTimeout(listenThemeEvents, 400)
    return
  }

  const subscribe = center.addListener?.bind(center) ?? center.addEventListener?.bind(center)
  if (!subscribe) return

  window._greensparkThemeEventsBound = true
  subscribe('variant:added', onCartRefresh)
  subscribe('cart:opened', onCartRefresh)
}

function currencyForTarget(target: HTMLElement, cartCurrency: string): string {
  return stampedCurrency(target) ?? parseCurrency(cartCurrency) ?? ''
}

function renderTargets(
  ctxBase: Omit<RunContext, 'currency'>,
  targetsToRender: HTMLElement[],
  cartCurrency: string,
): void {
  targetsToRender.forEach((target) => {
    const widgetId = resolveWidgetId(target)
    const variant = getWidgetVariant(widgetId)
    if (!variant) return

    const ctx: RunContext = {
      ...ctxBase,
      currency: currencyForTarget(target, cartCurrency),
    }
    const containerSelector = getWidgetContainer(target)
    renderWidget(ctx, variant, target, widgetId, containerSelector)
  })
}

export function runGreenspark(targets?: Iterable<Element>): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => runGreenspark(targets), { once: true })
    return
  }

  interceptCartMutations()
  listenThemeEvents()

  if (!window.GreensparkWidgets) {
    if (retryCount++ >= MAX_RETRIES) {
      err('run: GreensparkWidgets not available after max retries')
      return
    }
    window.setTimeout(() => runGreenspark(targets), 50)
    return
  }

  retryCount = 0

  const liveSlug = getShopUniqueName()
  if (!liveSlug) {
    err('run: missing shop.permanent_domain; skip widgets')
    return
  }

  const targetsToRender = getTargets(targets)
  if (targetsToRender.length === 0) return

  const useShadowDom = false
  const version = 'v2' as const
  const productId = getProductIdFromPage()
  const locale = getLocale()
  const greenspark = new window.GreensparkWidgets({
    locale,
    integrationSlug: getWidgetsClientSlug(liveSlug),
    // CDN still gates x-integration-slug on this alias.
    isShopifyIntegration: true,
    apiUrl: getGreensparkApiUrl(liveSlug),
  })

  const ctxBase: Omit<RunContext, 'currency'> = {
    greenspark,
    cartApi: createCartApi(),
    getWidgetContainer,
    movePopupToBody,
    clearWidgetMount,
    productId,
    useShadowDom,
    version,
  }

  injectWidgetStyles()

  ctxBase.cartApi
    .getOrder()
    .then((order) => {
      renderTargets(ctxBase, targetsToRender, order?.currency ?? '')
    })
    .catch((error: unknown) => {
      err('run: getOrder failed; rendering without cart currency', error)
      renderTargets(ctxBase, targetsToRender, '')
    })
}
