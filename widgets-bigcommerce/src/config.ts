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
 * Build store context. The merchant only places the script and a div with id; no params on the page.
 * - integrationSlug: must be set by the app via window.GreensparkBigCommerceConfig (BigCommerce does not expose store hash on the storefront; the app injects it from OAuth/install context, e.g. via theme script or app block).
 * - currency, locale, productId: from page/meta or defaults; optional override via window
 * - cartId: from bc_cartId cookie only
 * - storefrontApiBase: window.location.origin or override
 */
export function getConfig(): BigCommerceConfig | null {
  if (typeof window === 'undefined') {
    log('config: getConfig() => null (no window)')
    return null
  }
  const override = window.GreensparkBigCommerceConfig

  const integrationSlug = override?.integrationSlug ?? null
  if (!integrationSlug) {
    warn(
      'config: getConfig() => null (integrationSlug required). The app must set window.GreensparkBigCommerceConfig.integrationSlug (e.g. store hash from OAuth) before the widget script runs—e.g. via theme script or app embed.',
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
