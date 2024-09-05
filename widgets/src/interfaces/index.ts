import type { AVAILABLE_LOCALES, AVAILABLE_STATISTIC_TYPES, WIDGET_COLORS, WIDGET_COLORS_EXTENDED } from '@/constants'

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

export interface WidgetParams {
  version?: string
}

export interface CartWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  order: StoreOrder
  withPopup?: boolean
  simplified?: boolean
}

export interface SpendLevelWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  currency: string
  withPopup?: boolean
  simplified?: boolean
}

export interface PerOrderWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  currency: string
  withPopup?: boolean
  simplified?: boolean
}

export interface ByPercentageWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  withPopup?: boolean
  simplified?: boolean
}

export interface TieredSpendLevelWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  currency: string
  withPopup?: boolean
  simplified?: boolean
}

export interface PerProductWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  productId: string
  withPopup?: boolean
  simplified?: boolean
}

export interface TopStatsWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS_EXTENDED)[number]
  withPopup?: boolean
  version?: string
}

export interface FullWidthBannerWidgetParams extends WidgetParams{
  options: Array<(typeof AVAILABLE_STATISTIC_TYPES)[number]>
  imageUrl?: string
  title?: string
  description?: string
  showButton?: boolean
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
