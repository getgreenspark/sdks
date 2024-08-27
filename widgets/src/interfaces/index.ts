import type { AVAILABLE_LOCALES, WIDGET_COLORS } from '@/constants'

export interface ApiSettings {
  apiKey: string
  locale?: (typeof AVAILABLE_LOCALES)[number]
  shopUniqueName?: string
}

export interface ApiRequestBody {
  shopUniqueName: string
}

export interface OrderProduct {
  productId: string
  quantity: number
}

export interface StoreOrder {
  currency: string
  totalPrice: number
  lineItems: Array<OrderProduct>
}

export interface CartWidgetParams {
  color: (typeof WIDGET_COLORS.cart)[number]
  order: StoreOrder
  withPopup?: boolean
}

export interface SpendLevelWidgetParams {
  color: (typeof WIDGET_COLORS.spendLevel)[number]
  currency: string
  withPopup?: boolean
}

export interface PerOrderWidgetParams {
  color: (typeof WIDGET_COLORS.spendLevel)[number]
  currency: string
  withPopup?: boolean
}

export interface ByPercentageWidgetParams {
  color: (typeof WIDGET_COLORS.spendLevel)[number]
  withPopup?: boolean
}

export interface CartWidgetRequestBody extends ApiRequestBody, CartWidgetParams {}
export interface SpendLevelRequestBody extends ApiRequestBody, SpendLevelWidgetParams {}
export interface PerOrderRequestBody extends ApiRequestBody, PerOrderWidgetParams {}
export interface ByPercentageRequestBody extends ApiRequestBody, ByPercentageWidgetParams {}
