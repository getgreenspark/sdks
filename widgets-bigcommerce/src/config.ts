import {log, warn} from './debug'
import type {BigCommerceCart, BigCommerceConfig} from './interfaces'

const isDevStore =
  typeof window !== 'undefined' &&
  (window.location?.hostname?.includes('greenspark-development-store') ?? false)

export const widgetUrl = isDevStore
  ? 'https://cdn.getgreenspark.com/scripts/widgets%402.6.1-2.js'
  : 'https://cdn.getgreenspark.com/scripts/widgets%402.6.1-2.js'

export function getScriptSrc(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const src = (document.currentScript as HTMLScriptElement | null)?.getAttribute('src') ?? undefined
  log('config: getScriptSrc() =>', src ?? '(none)')
  return src
}

export function getGreensparkApiUrl(integrationSlug: string): string {
  const dev = true //integrationSlug.includes('greenspark-development-store')
  const url = dev ? 'https://dev-api.getmads.com' : 'https://api.getgreenspark.com'
  log('config: getGreensparkApiUrl(', integrationSlug, ') =>', url)
  return url
}

/**
 * Try to detect current product id from page (PDP). Used for per-product widgets.
 */
function getProductIdFromPage(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const el = document.querySelector('[data-product-id]') as HTMLElement | null
  const id = el?.getAttribute?.('data-product-id')
  if (id) return id
  const meta = document.querySelector('meta[property="product:id"]') as HTMLMetaElement | null
  if (meta?.content) return meta.content
  return undefined
}

/**
 * Discover integrationSlug from the first widget target (data-integration-slug).
 * Div-only setup: no window config required.
 */
function getIntegrationSlugFromTarget(): string | null {
  if (typeof document === 'undefined') return null
  const first = document.querySelector('.greenspark-widget-target') as HTMLElement | null
  const slug = first?.getAttribute?.('data-integration-slug')?.trim()
  return slug || null
}

/**
 * Build store context from the page and widget target div(s).
 * - integrationSlug: from first .greenspark-widget-target[data-integration-slug] (required).
 * - currency, locale, productId: from page/meta or defaults; optional override via window.GreensparkBigCommerceConfig.
 * - cartId: from bc_cartId cookie only
 * - storefrontApiBase: window.location.origin or override
 */
export function getConfig(): BigCommerceConfig | null {
  if (typeof window === 'undefined') {
    log('config: getConfig() => null (no window)')
    return null
  }
  const override = window.GreensparkBigCommerceConfig

  const integrationSlug = getIntegrationSlugFromTarget()
  if (!integrationSlug) {
    warn(
      'config: getConfig() => null (integrationSlug required). Add data-integration-slug on a .greenspark-widget-target div.',
    )
    return null
  }

  const currency =
    override?.currency ??
    (document.querySelector('meta[property="product:price:currency"]') as HTMLMetaElement | null)
      ?.content ??
    'USD'
  const locale =
    (override?.locale ?? document.documentElement.lang?.slice(0, 2) ?? 'en') as string
  const productId = override?.productId ?? getProductIdFromPage()
  const storefrontApiBase = override?.storefrontApiBase ?? window.location.origin
  const cartId = override?.cartId ?? undefined

  const config: BigCommerceConfig = {
    integrationSlug,
    currency,
    locale,
    storefrontApiBase,
    ...(productId && {productId}),
    ...(cartId && {cartId}),
  }
  log('config: getConfig() => discovered + overrides', config)
  return config
}

export function parseCart(cart: BigCommerceCart) {
  const lineItems = cart.items.map((item) => ({
    productId: String(item.productId),
    quantity: item.quantity,
  }))
  return {
    lineItems,
    currency: cart.currency,
    totalPrice: cart.total_price,
  }
}
