import { log, warn } from './debug'
import type { BigCommerceConfig } from './interfaces'

const IS_DEV_STORE = true as const

export const widgetUrl = IS_DEV_STORE
  ? 'https://cdn.getgreenspark.com/scripts/widgets%402.6.1-2.js'
  : 'https://cdn.getgreenspark.com/scripts/widgets%40latest.js'

export function getScriptSrc(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const src = (document.currentScript as HTMLScriptElement | null)?.getAttribute('src') ?? undefined
  log('config: getScriptSrc() =>', src ?? '(none)')
  return src
}

/**
 * Resolve active store currency from the page (e.g. [data-currency-code] on body or currency selector).
 * Use as fallback when cart is empty or cart API fails. Not from widget div config.
 */
export function getActiveCurrencyCode(): string {
  if (typeof document === 'undefined') return 'USD'
  const el = document.querySelector('[data-currency-code]')
  const code = (el as HTMLElement | null)?.getAttribute?.('data-currency-code')?.trim()
  return code && /^[A-Z]{3}$/.test(code) ? code : 'USD'
}

/**
 * Resolve current page locale from document (e.g. <html lang="...">). Dynamic, not from widget div config.
 */
export function getLocale(): string {
  if (typeof document === 'undefined') return 'en'
  return document.documentElement.getAttribute('lang') || 'en'
}

/**
 * Detect current product id from PDP add-to-cart form. Dynamic, not from widget div config.
 */
export function getProductIdFromPage(): string {
  if (typeof document === 'undefined') return ''
  const pdpProductId =
    (document.querySelector('.productView form[action*="cart.php"] input[name="product_id"]') as HTMLInputElement | null)
      ?.value ||
    (document.querySelector('form[action*="cart.php"] input[name="product_id"]') as HTMLInputElement | null)?.value
  return pdpProductId ?? ''
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
 * Build config from the widget target div(s). Only integrationSlug from div; locale/productId are dynamic (see getLocale, getProductIdFromPage).
 */
export function getConfig(): BigCommerceConfig | null {
  if (typeof window === 'undefined') {
    log('config: getConfig() => null (no window)')
    return null
  }
  const integrationSlug = getIntegrationSlugFromTarget()
  if (!integrationSlug) {
    warn(
      'config: getConfig() => null (integrationSlug required). Add data-integration-slug on a .greenspark-widget-target div.',
    )
    return null
  }

  const config: BigCommerceConfig = { integrationSlug }
  log('config: getConfig() => discovered + overrides', config)
  return config
}
