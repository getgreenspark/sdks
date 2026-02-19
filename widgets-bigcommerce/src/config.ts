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
 * - locale, productId: from page or defaults
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

  const locale =
    (document.documentElement.lang?.slice(0, 2) ?? 'en') as string
  const productId = getProductIdFromPage()

  const config: BigCommerceConfig = {
    integrationSlug,
    locale,
    ...(productId && { productId }),
  }
  log('config: getConfig() => discovered + overrides', config)
  return config
}
