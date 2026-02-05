import type GreensparkWidgets from '@/index'
import type { CartWidgetById } from '@/widgets/cartById'
import type { BigCommerceConfig } from './interfaces'

export type GreensparkCartWidgetKey = `greensparkCartWidget-${string}`

declare global {
  interface Window extends Partial<Record<GreensparkCartWidgetKey, CartWidgetById>> {
    GreensparkWidgets: typeof GreensparkWidgets
    /** Set by app or widget template before script runs. */
    GreensparkBigCommerceConfig?: BigCommerceConfig
    GreensparkWidgets?: typeof GreensparkWidgets
    _greensparkCheckboxHandlerBound?: boolean
    _greensparkRemoveHandlerBound?: boolean
    _greensparkPreselectOptOut?: boolean
    _greensparkPreselectAddInProgress?: Record<string, boolean | undefined>
  }
}

export {}
