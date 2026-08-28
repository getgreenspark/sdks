export const GREENSPARK_API = {
  dev: 'https://dev-api.getmads.com',
  prod: 'https://api.getgreenspark.com',
} as const

/** Same pin as shopline-widgets-cli — not widgets@2.6.3. */
export const PINNED_WIDGET_SDK_URL =
  'https://cdn.getgreenspark.com/scripts/widgets%402.2.0-2-umd.js'
export const LATEST_WIDGET_SDK_URL = 'https://cdn.getgreenspark.com/scripts/widgets%40latest.js'

/** Theme editor always constructs the CDN client with this slug. */
export const PREVIEW_INTEGRATION_SLUG = 'GS_PREVIEW'

const ISO_4217 = /^[A-Za-z]{3}$/

interface CapturedScriptAttrs {
  integrationSlug?: string
}

let capturedScript: CapturedScriptAttrs = {}

/** currentScript is null after async load; capture attrs at parse time. */
export function captureScriptEl(script: HTMLScriptElement | null): void {
  capturedScript = {
    integrationSlug:
      script?.getAttribute('data-gs-integration-slug') ||
      script?.getAttribute('data-integration-slug') ||
      undefined,
  }
}

export function isTrue(value: string | boolean): boolean {
  return value === true || value === 'true' || value === '1'
}

/** First DNS label of shop.permanent_domain (e.g. bags-dev from bags-dev.myshopline.com). */
export function shopHandle(slug: string): string {
  return slug.trim().toLowerCase().split('.')[0] ?? ''
}

/**
 * QA store if the shop handle has the hyphen-delimited token `gs-dev` or
 * `greenspark-dev` (not a raw substring; bags-dev is not QA).
 */
export function isGsDevStore(slug: string): boolean {
  const handle = shopHandle(slug)
  return /(^|-)gs-dev(-|$)/.test(handle) || /(^|-)greenspark-dev(-|$)/.test(handle)
}

/** Widget API expects a 3-letter ISO 4217 code. Missing or invalid → undefined. */
export function parseCurrency(raw: string): string | undefined {
  const trimmed = raw.trim()
  if (ISO_4217.test(trimmed)) return trimmed.toLowerCase()
  return undefined
}

/** Script attr wins; DOM stamp next. Never location.hostname. */
export function resolveIntegrationSlug(fromScript?: string, fromDom?: string): string {
  const script = fromScript?.trim() ?? ''
  if (script) return script
  return fromDom?.trim() ?? ''
}

/**
 * Shop identity is shop.permanent_domain. Empty string means fail closed.
 */
export function getShopUniqueName(): string {
  const stamped = document.querySelector('[data-gs-integration-slug], [data-integration-slug]')
  const fromDom =
    stamped?.getAttribute('data-gs-integration-slug') ||
    stamped?.getAttribute('data-integration-slug') ||
    undefined
  return resolveIntegrationSlug(capturedScript.integrationSlug, fromDom)
}

/**
 * Theme editor: Sline request.design_mode stamp, else window.Shopline.designMode.
 * Do not use self !== top — cart/checkout iframes are not the editor.
 */
export function isDesignMode(el?: Element | null): boolean {
  if (el && isTrue(el.getAttribute('data-gs-design-mode') ?? '')) return true
  if (window.Shopline?.designMode === true) return true
  if (!el) {
    return Boolean(document.querySelector('[data-gs-design-mode="true"]'))
  }
  return false
}

export function widgetSdkUrl(slug: string): string {
  return isGsDevStore(slug) ? PINNED_WIDGET_SDK_URL : LATEST_WIDGET_SDK_URL
}

export function getGreensparkApiUrl(shopUniqueName: string): string {
  return isGsDevStore(shopUniqueName) ? GREENSPARK_API.dev : GREENSPARK_API.prod
}

/** Live slug for QA routing; GS_PREVIEW in the theme editor so the canvas does not hit the merchant. */
export function getWidgetsClientSlug(liveSlug: string, el?: Element | null): string {
  return isDesignMode(el) ? PREVIEW_INTEGRATION_SLUG : liveSlug
}

export function getLocale(): string {
  return document.documentElement.getAttribute('lang') || window.navigator.language || 'en'
}

export function stampedCurrency(el: Element): string | undefined {
  return parseCurrency(el.getAttribute('data-gs-currency') ?? '')
}

/** PDP-only: one product per page. Stamp first, then `product:viewed`. */
export function getProductIdFromPage(): string {
  const stamped = document.querySelector('[data-gs-product-id]')?.getAttribute('data-gs-product-id')
  if (stamped) return stamped

  const viewed = window.themeEventCenter?.getCurrentDetail?.('product:viewed')
  if (typeof viewed?.productId === 'string') return viewed.productId

  return ''
}
