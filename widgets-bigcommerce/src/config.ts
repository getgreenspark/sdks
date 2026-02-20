import {err} from './debug'
import type {BigCommerceConfig} from './interfaces'

const IS_DEV_STORE = true as const // TODO: update on release

export const widgetUrl = IS_DEV_STORE
  ? 'https://cdn.getgreenspark.com/scripts/widgets%402.6.1-3.js'
  : 'https://cdn.getgreenspark.com/scripts/widgets%40latest.js'

export function getScriptSrc(): string | undefined {
  if (typeof document === 'undefined') return undefined
  return (document.currentScript as HTMLScriptElement | null)?.getAttribute('src') ?? undefined
}

export function getActiveCurrencyCode(): string {
  if (typeof document === 'undefined') return 'USD'
  const el = document.querySelector('[data-currency-code]')
  const code = (el as HTMLElement | null)?.getAttribute?.('data-currency-code')?.trim()
  return code && /^[A-Z]{3}$/.test(code) ? code : 'USD'
}

export function getLocale(): string {
  if (typeof document === 'undefined') return 'en'
  return document.documentElement.getAttribute('lang') || 'en'
}

export function getProductIdFromPage(): string {
  if (typeof document === 'undefined') return ''
  const pdpProductId =
    (document.querySelector('.productView form[action*="cart.php"] input[name="product_id"]') as HTMLInputElement | null)
      ?.value ||
    (document.querySelector('form[action*="cart.php"] input[name="product_id"]') as HTMLInputElement | null)?.value
  return pdpProductId ?? ''
}

function getIntegrationSlugFromTarget(): string | null {
  if (typeof document === 'undefined') return null
  const first = document.querySelector('.greenspark-widget-target') as HTMLElement | null
  const slug = first?.getAttribute?.('data-integration-slug')?.trim()
  return slug || null
}

export function getConfig(): BigCommerceConfig | null {
  if (typeof window === 'undefined') return null
  const integrationSlug = getIntegrationSlugFromTarget()
  if (!integrationSlug) {
    err('config: getConfig() => null (integrationSlug required). Add data-integration-slug on a .greenspark-widget-target div.')
    return null
  }

  return {integrationSlug}
}
