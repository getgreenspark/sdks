import { log, warn } from './debug'
import type { BigCommerceCart, BigCommerceConfig } from './interfaces'

const isDevStore =
  typeof window !== 'undefined' &&
  (window.location?.hostname?.includes('greenspark-development-store') ?? false)

export const widgetUrl = isDevStore
  ? 'https://cdn.getgreenspark.com/scripts/widgets%402.5.0.js'
  : 'https://cdn.getgreenspark.com/scripts/widgets%40latest.js'

export function getScriptSrc(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const src = (document.currentScript as HTMLScriptElement | null)?.getAttribute('src') ?? undefined
  log('config: getScriptSrc() =>', src ?? '(none)')
  return src
}

export function getGreensparkApiUrl(integrationSlug: string): string {
  const dev = integrationSlug.includes('greenspark-development-store')
  const url = dev ? 'https://dev-api.getmads.com' : 'https://api.getgreenspark.com'
  log('config: getGreensparkApiUrl(', integrationSlug, ') =>', url)
  return url
}

export function getConfig(): BigCommerceConfig | null {
  if (typeof window === 'undefined') {
    log('config: getConfig() => null (no window)')
    return null
  }
  const c = window.GreensparkBigCommerceConfig
  if (c?.integrationSlug) {
    log('config: getConfig() => from window.GreensparkBigCommerceConfig', {
      integrationSlug: c.integrationSlug,
      currency: c.currency,
      locale: c.locale,
      productId: c.productId,
    })
    return c
  }
  const script = document.currentScript as HTMLScriptElement | null
  const integrationSlug =
    script?.getAttribute('data-integration-slug') ??
    document.querySelector('.greenspark-widget-target')?.getAttribute('data-integration-slug')
  if (!integrationSlug) {
    warn('config: getConfig() => null (no integrationSlug from script or .greenspark-widget-target)')
    return null
  }
  const config = {
    integrationSlug,
    productId: script?.getAttribute('data-product-id') ?? undefined,
    currency: script?.getAttribute('data-currency') ?? undefined,
    locale: (script?.getAttribute('data-locale') ?? 'en') as 'en',
    cartId: script?.getAttribute('data-cart-id') ?? undefined,
    storefrontApiBase: script?.getAttribute('data-storefront-api-base') ?? undefined,
  }
  log('config: getConfig() => from data attributes', config)
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
