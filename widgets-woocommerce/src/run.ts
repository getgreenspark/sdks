import {
  getCurrency,
  getConfig,
  getLocale,
  getProductIdFromPage,
  getScriptSrc,
} from './config'
import { createCartApi } from './cart'
import { getWidgetContainer, movePopupToBody } from './dom'
import { err } from './debug'
import { EnumToWidgetTypeMap, type WidgetVariant } from './interfaces'
import { renderWidget } from './widgets'

const MAX_RETRIES = 5
let retryCount = 0

function injectWidgetStyles(): void {
  if (document.getElementById('greenspark-widget-style')) return
  const style = document.createElement('style')
  style.id = 'greenspark-widget-style'
  style.textContent = `
    .greenspark-widget-target {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px 0;
    }
  `
  document.head.appendChild(style)
}

export function runGreenspark(): void {
  const scriptSrc = getScriptSrc()
  if (!scriptSrc && typeof document === 'undefined') return
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runGreenspark, { once: true })
    return
  }

  const config = getConfig()
  if (!config?.integrationSlug) {
    return
  }

  if (!window.GreensparkWidgets) {
    if (retryCount++ >= MAX_RETRIES) {
      err('run: GreensparkWidgets not available after', MAX_RETRIES, 'retries – check core script load')
      return
    }
    setTimeout(runGreenspark, 50)
    return
  }
  retryCount = 0

  const useShadowDom = false
  const version = 'v2' as const
  const productId = getProductIdFromPage()
  const locale = getLocale()
  const integrationSlug = config.integrationSlug

  const greenspark = new window.GreensparkWidgets({
    locale,
    integrationSlug,
    isShopifyIntegration: true,
  })
  const cartApi = createCartApi()

  function runWithContext(currency: string) {
    const ctx = {
      greenspark,
      cartApi,
      getWidgetContainer,
      movePopupToBody,
      productId,
      currency,
      useShadowDom,
      version,
    }
    injectWidgetStyles()
    const targets = document.querySelectorAll('.greenspark-widget-target')
    if (targets.length === 0) return

    targets.forEach((target) => {
      const el = target as HTMLElement
      const rawId = el.id
      el.querySelectorAll('.greenspark-widget-instance').forEach((e) => e.remove())
      let type: string
      try {
        ;[type] = atob(rawId).split('|')
      } catch (e) {
        err('run: invalid widget id (not base64 type|widgetId):', rawId, e)
        return
      }
      const variant = EnumToWidgetTypeMap[type] as WidgetVariant | undefined
      if (!variant) {
        err('run: unknown widget type', type, '– known types: 0–9 (see EnumToWidgetTypeMap)')
        return
      }
      const widgetId = rawId
      const containerSelector = getWidgetContainer(widgetId)
      renderWidget(ctx, variant, widgetId, containerSelector)
    })
  }

  function renderFromCart() {
    cartApi.getCart().then((order) => runWithContext(order.currency || getCurrency())).catch((e) => {
      err('run: getCart failed, using getCurrency() for currency', e)
      runWithContext(getCurrency())
    })
  }

  renderFromCart()
  interceptCartMutations(() => renderFromCart())
  listenWooCommerceEvents(() => renderFromCart())
}

/**
 * Matches WC Store API cart endpoints and classic wc-ajax cart actions.
 * Store API: /wc/store/v1/cart/add-item, /cart/update-item, /cart/remove-item, etc.
 * Classic:   ?wc-ajax=add_to_cart, ?wc-ajax=update_order_review, etc.
 */
const WC_CART_API_PATTERN = /(\/wc\/store\/v\d+\/cart\/|[?&]wc-ajax=)/
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function resolveFetchMethod(input: RequestInfo | URL, init?: RequestInit): string {
  if (init?.method) return init.method.toUpperCase()
  if (typeof Request !== 'undefined' && input instanceof Request) return input.method.toUpperCase()
  return 'GET'
}

function interceptCartMutations(onCartChange: () => void): void {
  if (typeof window !== 'undefined' && window.__greensparkWcCartMutationHooks) {
    return
  }
  if (typeof window !== 'undefined') {
    window.__greensparkWcCartMutationHooks = true
  }

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  function debouncedChange() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(onCartChange, 300)
  }

  const originalFetch = window.fetch.bind(window)
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const result = originalFetch(input, init)
    const method = resolveFetchMethod(input, init)
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (MUTATING_METHODS.has(method) && WC_CART_API_PATTERN.test(url)) {
      result.then((res) => {
        if (res.ok) debouncedChange()
      })
    }
    return result
  }

  const XHR = XMLHttpRequest.prototype
  const originalOpen = XHR.open
  const originalSend = XHR.send
  XHR.open = function (this: XMLHttpRequest & {
    _gsMethod?: string;
    _gsUrl?: string
  }, method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null) {
    this._gsMethod = method.toUpperCase()
    this._gsUrl = typeof url === 'string' ? url : url.href
    originalOpen.call(this, method, url, async ?? true, username ?? null, password ?? null)
  }
  XHR.send = function (this: XMLHttpRequest & {
    _gsMethod?: string;
    _gsUrl?: string
  }, body?: Document | XMLHttpRequestBodyInit | null) {
    if (this._gsMethod && MUTATING_METHODS.has(this._gsMethod) && this._gsUrl && WC_CART_API_PATTERN.test(this._gsUrl)) {
      this.addEventListener('load', () => {
        if (this.status >= 200 && this.status < 300) debouncedChange()
      })
    }
    originalSend.call(this, body)
  }
}

/**
 * Listen for WooCommerce jQuery-triggered events that indicate cart/checkout changes.
 * These fire in classic (non-block) WooCommerce themes.
 */
function listenWooCommerceEvents(onCartChange: () => void): void {
  const events = [
    'added_to_cart',
    'removed_from_cart',
    'updated_cart_totals',
    'updated_checkout',
    'updated_wc_div',
  ]

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  function debouncedChange() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(onCartChange, 300)
  }

  if (typeof jQuery !== 'undefined') {
    const $body = jQuery(document.body)
    events.forEach((evt) => $body.on(evt, () => debouncedChange()))
  }

  const domEvents = [
    'wc-blocks_added_to_cart',
    'wc-blocks_removed_from_cart',
  ]
  domEvents.forEach((evt) => document.addEventListener(evt, () => debouncedChange()))
}
