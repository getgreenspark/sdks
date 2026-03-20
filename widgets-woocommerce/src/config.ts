import { err } from './debug'
import type { WooCommerceConfig } from './interfaces'

export const widgetUrl = 'https://cdn.getgreenspark.com/scripts/widgets%40latest.js'

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
  const raw =
    typeof window !== 'undefined' && window.greensparkWC?.storeApiBase
      ? window.greensparkWC.storeApiBase
      : '/wp-json/wc/store/v1'
  return raw.replace(/\/+$/, '')
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

export function getConfig(): WooCommerceConfig | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null
  const first = document.querySelector('.greenspark-widget-target')
  if (!first) return null
  const slug = first.getAttribute('data-integration-slug')?.trim()
  if (!slug) {
    err(
      'config: .greenspark-widget-target found but data-integration-slug is missing or empty. Add it per your Greenspark embed instructions.',
    )
    return null
  }
  return { integrationSlug: slug }
}
