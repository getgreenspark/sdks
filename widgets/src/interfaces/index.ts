import type { AVAILABLE_LOCALES, AVAILABLE_STATISTIC_TYPES, WIDGET_COLORS } from '@/constants'

export interface ApiSettings {
  apiKey: string
  locale?: (typeof AVAILABLE_LOCALES)[number]
  shopUniqueName?: string
}

export interface ExternalShopContext {
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
  color: (typeof WIDGET_COLORS)[number]
  order: StoreOrder
  withPopup?: boolean
}

export interface SpendLevelWidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  currency: string
  withPopup?: boolean
}

export interface PerOrderWidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  currency: string
  withPopup?: boolean
}

export interface ByPercentageWidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  withPopup?: boolean
}

export interface TieredSpendLevelWidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  currency: string
  withPopup?: boolean
}

export interface PerProductWidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  productId: string
  withPopup?: boolean
}

export interface TopStatsWidgetParams {
  color: (typeof WIDGET_COLORS)[number]
}

export interface FullWidthBannerWidgetParams {
  options: Array<(typeof AVAILABLE_STATISTIC_TYPES)[number]>
  imageUrl?: string
}

export interface CartWidgetRequestBody extends ExternalShopContext, CartWidgetParams {}
export interface SpendLevelRequestBody extends ExternalShopContext, SpendLevelWidgetParams {}
export interface PerOrderRequestBody extends ExternalShopContext, PerOrderWidgetParams {}
export interface ByPercentageRequestBody extends ExternalShopContext, ByPercentageWidgetParams {}
export interface TieredSpendLevelRequestBody
  extends ExternalShopContext,
    TieredSpendLevelWidgetParams {}
export interface PerProductRequestBody extends ExternalShopContext, PerProductWidgetParams {}
export type TopStatsRequestBody = TopStatsWidgetParams
export type FullWidthBannerRequestBody = FullWidthBannerWidgetParams
