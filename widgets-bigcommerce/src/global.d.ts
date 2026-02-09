import type GreensparkWidgets from '@/index'
import type { CartWidgetById } from '@/widgets/cartById'
import type { BigCommerceConfig } from './interfaces'

export type GreensparkCartWidgetKey = `greensparkCartWidget-${string}`

declare global {
  interface Window extends Partial<Record<GreensparkCartWidgetKey, CartWidgetById>> {
    GreensparkWidgets: typeof GreensparkWidgets
    /** Optional. Set by app/theme for custom domains or overrides; not required when store uses store-XXX.mybigcommerce.com. */
    GreensparkBigCommerceConfig?: Partial<BigCommerceConfig>
    GreensparkWidgets?: typeof GreensparkWidgets
    _greensparkCheckboxHandlerBound?: boolean
    _greensparkRemoveHandlerBound?: boolean
    _greensparkPreselectOptOut?: boolean
    _greensparkPreselectAddInProgress?: Record<string, boolean | undefined>
  }
}

export {}
