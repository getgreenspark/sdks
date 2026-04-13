import {
  getActiveCurrencyCode,
  getConfig,
  getLocale,
  getProductIdFromPage,
  getScriptSrc,
} from './config'
import {createCartApi} from './cart'
import {getWidgetContainer, movePopupToBody} from './dom'
import {err} from './debug'
import {
  WIDGET_BY_ID_TYPES,
  WIDGET_TYPES,
  type WidgetByIdType,
  type WidgetTargetConfig,
  type WidgetType,
} from './interfaces'
import {renderLegacyWidget, renderWidget} from './widgets'

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

/** Parse data-* attributes from a widget target div into a typed config object. */
function parseWidgetConfig(el: HTMLElement): WidgetTargetConfig | null {
  const widgetType = el.getAttribute('data-widget-type')?.trim()
  if (!widgetType) return null
  if (!WIDGET_TYPES.has(widgetType)) {
    err('run: unknown data-widget-type:', widgetType, '— expected one of:', [...WIDGET_TYPES].join(', '))
    return null
  }

  return {
    widgetType: widgetType as WidgetType,
    color: el.getAttribute('data-color') ?? undefined,
    style: el.getAttribute('data-style') ?? undefined,
    withPopup: el.getAttribute('data-with-popup') === 'true',
    popupTheme: el.getAttribute('data-popup-theme') ?? undefined,
    title: el.getAttribute('data-title') ?? undefined,
    description: el.getAttribute('data-description') ?? undefined,
    imageUrl: el.getAttribute('data-image-url') ?? undefined,
    ctaUrl: el.getAttribute('data-cta-url') ?? undefined,
    textColor: el.getAttribute('data-text-color') ?? undefined,
    buttonBgColor: el.getAttribute('data-button-bg-color') ?? undefined,
    buttonTextColor: el.getAttribute('data-button-text-color') ?? undefined,
  }
}

/** Assign a stable unique ID to each target div so dom.ts helpers can reference it. */
function ensureTargetId(el: HTMLElement, index: number): string {
  if (!el.id) {
    el.id = `gs-target-${index}`
  }
  return el.id
}

/**
 * Pre–Page Builder: target div had `id` set to base64(`"<enumDigit>|<widgetEditorId>"`).
 * Returns null if the element does not use that pattern.
 */
function tryParseLegacyWidgetTarget(el: HTMLElement): {
  widgetId: string;
  variant: WidgetByIdType
} | null {
  const rawId = el.id?.trim()
  if (!rawId) return null
  let decoded: string
  try {
    decoded = atob(rawId)
  } catch {
    return null
  }
  const [typeDigit] = decoded.split('|')
  if (!typeDigit || !WIDGET_BY_ID_TYPES[typeDigit]) return null
  return {widgetId: rawId, variant: WIDGET_BY_ID_TYPES[typeDigit]}
}

export function runGreenspark(): void {
  const scriptSrc = getScriptSrc()
  if (!scriptSrc && typeof document === 'undefined') return
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runGreenspark, {once: true})
    return
  }

  const config = getConfig()
  if (!config?.integrationSlug) {
    err('run: missing integrationSlug – add data-integration-slug on a .greenspark-widget-target div')
    return
  }
  const cfg = config

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
  const integrationSlug = cfg.integrationSlug
  const baseUrl = window.location.origin

  const greenspark = new window.GreensparkWidgets({
    locale,
    integrationSlug,
    isShopifyIntegration: true,
  })
  const cartApi = createCartApi(baseUrl)

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
    if (targets.length === 0) {
      err('run: no .greenspark-widget-target in DOM – ensure Page Builder widget is placed on the page')
    }
    targets.forEach((target, index) => {
      const el = target as HTMLElement
      el.querySelectorAll('.greenspark-widget-instance').forEach((e) => e.remove())

      const widgetConfig = parseWidgetConfig(el)
      if (widgetConfig) {
        const targetId = ensureTargetId(el, index)
        const containerSelector = getWidgetContainer(targetId)
        renderWidget(ctx, widgetConfig, targetId, containerSelector)
        return
      }

      const legacy = tryParseLegacyWidgetTarget(el)
      if (legacy) {
        const containerSelector = getWidgetContainer(legacy.widgetId)
        renderLegacyWidget(ctx, legacy.variant, legacy.widgetId, containerSelector)
        return
      }

      err(
        'run: widget target needs data-widget-type (Page Builder) or a legacy base64 id (theme). See Greenspark BigCommerce install guide.',
      )
    })
  }

  function renderFromCart() {
    cartApi.getCart().then((order) => runWithContext(order.currency || getActiveCurrencyCode())).catch((e) => {
      err('run: getCart failed, using getActiveCurrencyCode() for currency', e)
      runWithContext(getActiveCurrencyCode())
    })
  }

  renderFromCart()
  interceptCartMutations(() => renderFromCart())
}

/** Matches REST Storefront carts API and BigCommerce remote cart (e.g. /remote/v1/cart/update). */
const CART_API_PATTERN = /\/(api\/storefront\/carts|remote\/v1\/cart\/)/
const MUTATING_METHODS = new Set(['POST', 'PUT', 'DELETE'])

function interceptCartMutations(onCartChange: () => void): void {
  const originalFetch = window.fetch
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const result = originalFetch.call(this, input, init)
    const method = (init?.method ?? 'GET').toUpperCase()
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (MUTATING_METHODS.has(method) && CART_API_PATTERN.test(url)) {
      result.then((res) => {
        if (res.ok) onCartChange()
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
    if (this._gsMethod && MUTATING_METHODS.has(this._gsMethod) && this._gsUrl && CART_API_PATTERN.test(this._gsUrl)) {
      this.addEventListener('load', () => {
        if (this.status >= 200 && this.status < 300) onCartChange()
      })
    }
    originalSend.call(this, body)
  }
}
