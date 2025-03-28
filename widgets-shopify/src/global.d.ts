import type GreensparkWidgets from '@/index'
import type { Shopify, ShopifyAnalytics } from './interfaces'

declare global {
  interface Window {
    GreensparkWidgets: typeof GreensparkWidgets
    Shopify: Shopify
    ShopifyAnalytics: ShopifyAnalytics
  }
}

export {}
