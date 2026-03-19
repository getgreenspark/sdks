import { err } from './debug'
import type { WooCommerceConfig } from './interfaces'

export const widgetUrl = 'https://cdn.getgreenspark.com/scripts/widgets%40latest.js'

export function getScriptSrc(): string | undefined {
  if (typeof document === 'undefined') return undefined
  return (document.currentScript as HTMLScriptElement | null)?.getAttribute('src') ?? undefined
}

export function getLocale(): string {
  if (typeof window !== 'undefined' && window.greensparkWC?.locale) {
    return window.greensparkWC.locale
  }
  if (typeof document === 'undefined') return 'en'
  return document.documentElement.getAttribute('lang')?.split('-')[0] || 'en'
}

export function getCurrency(): string {
  if (typeof window !== 'undefined' && window.greensparkWC?.currency) {
    return window.greensparkWC.currency
  }
  return 'USD'
}

export function getStoreApiBase(): string {
  if (typeof window !== 'undefined' && window.greensparkWC?.storeApiBase) {
    return window.greensparkWC.storeApiBase
  }
  return '/wp-json/wc/store/v1'
}

export function getProductIdFromPage(): string {
  if (typeof window !== 'undefined' && window.greensparkWC?.productId) {
    return window.greensparkWC.productId
  }
  if (typeof document === 'undefined') return ''

  const variationInput = document.querySelector('form.cart input[name="variation_id"]') as HTMLInputElement | null
  if (variationInput?.value && variationInput.value !== '0') {
    return variationInput.value
  }

  const productInput = document.querySelector('form.cart input[name="product_id"]') as HTMLInputElement | null
  if (productInput?.value) {
    return productInput.value
  }

  const addToCartButton = document.querySelector('.single_add_to_cart_button') as HTMLElement | null
  if (addToCartButton?.getAttribute('value')) {
    return addToCartButton.getAttribute('value') || ''
  }

  return ''
}

function getIntegrationSlugFromTarget(): string | null {
  if (typeof document === 'undefined') return null
  const first = document.querySelector('.greenspark-widget-target') as HTMLElement | null
  const slug = first?.getAttribute?.('data-integration-slug')?.trim()
  return slug || null
}

export function getConfig(): WooCommerceConfig | null {
  if (typeof window === 'undefined') return null
  const integrationSlug = getIntegrationSlugFromTarget()
  if (!integrationSlug) {
    err('config: getConfig() => null (integrationSlug required). Add data-integration-slug on a .greenspark-widget-target div.')
    return null
  }
  return { integrationSlug }
}
