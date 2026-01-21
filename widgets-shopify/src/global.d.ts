import type GreensparkWidgets from '@/index'
import type {CartWidgetById} from '@/widgets/cartById'
import type {Shopify, ShopifyAnalytics} from './interfaces'

export type GreensparkCartWidgetKey = `greensparkCartWidget-${string}`

declare global {
  interface Window
    extends Partial<Record<GreensparkCartWidgetKey, CartWidgetById>> {
    GreensparkWidgets: typeof GreensparkWidgets
    Shopify: Shopify
    ShopifyAnalytics: ShopifyAnalytics
    _greensparkCheckboxHandlerBound?: boolean
    _greensparkRemoveHandlerBound?: boolean
    _greensparkPreselectOptOut?: boolean
    _greensparkPreselectAddInProgress?: Record<string, boolean | undefined>
  }
}

export {}
