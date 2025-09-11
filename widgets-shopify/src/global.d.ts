import type GreensparkWidgets from '@/index'
import type { CartWidgetById } from '@/widgets/cartById'
import type { Shopify, ShopifyAnalytics } from './interfaces'

declare global {
  interface Window {
    GreensparkWidgets: typeof GreensparkWidgets
    Shopify: Shopify
    ShopifyAnalytics: ShopifyAnalytics
    greensparkCartWidget?: CartWidgetById
    _greensparkCheckboxHandlerBound?: boolean
    _greensparkRemoveHandlerBound?: boolean
    _greensparkPreselectOptOut?: boolean
  }
}

export {}
