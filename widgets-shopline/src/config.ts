export const GREENSPARK_API = {
  dev: 'https://dev-api.getmads.com',
  prod: 'https://api.getgreenspark.com',
} as const

interface CapturedScriptAttrs {
  src?: string
  integrationSlug?: string
  widgetId?: string
}

let capturedScript: CapturedScriptAttrs = {}

/** currentScript is null after async load; capture attrs at parse time. */
export function captureScriptEl(script: HTMLScriptElement | null): void {
  capturedScript = {
    src: script?.getAttribute('src') ?? undefined,
    integrationSlug:
      script?.getAttribute('data-integration-slug') ||
      script?.getAttribute('data-gs-integration-slug') ||
      undefined,
    widgetId:
      script?.getAttribute('data-widget-id') || script?.getAttribute('data-gs-widget-id') || undefined,
  }
}

export function getCapturedScriptSrc(): string | undefined {
  return capturedScript.src
}

export function getCapturedWidgetId(): string | undefined {
  return capturedScript.widgetId
}

/** QA handles must include gs-dev or greenspark-dev (not a SHOPLINE platform flag). */
export function isGsDevStore(context: string): boolean {
  const value = context.toLowerCase()
  return value.includes('gs-dev') || value.includes('greenspark-dev')
}

export function getShopUniqueName(): string {
  if (capturedScript.integrationSlug) return capturedScript.integrationSlug

  const stamped = document.querySelector('[data-gs-integration-slug], [data-integration-slug]')
  const fromDom =
    stamped?.getAttribute('data-gs-integration-slug') ||
    stamped?.getAttribute('data-integration-slug')
  if (fromDom) return fromDom

  return window.location.hostname
}

export function getGreensparkApiUrl(shopUniqueName: string): string {
  return isGsDevStore(shopUniqueName) ? GREENSPARK_API.dev : GREENSPARK_API.prod
}

export function getLocale(): string {
  return document.documentElement.getAttribute('lang') || window.navigator.language || 'en'
}

export function getProductIdFromPage(): string {
  const stamped = document.querySelector('[data-gs-product-id]')?.getAttribute('data-gs-product-id')
  if (stamped) return stamped

  const viewed = window.themeEventCenter?.getCurrentDetail?.('product:viewed')
  if (typeof viewed?.productId === 'string') return viewed.productId

  return ''
}
