import type {
  AVAILABLE_LOCALES,
  AVAILABLE_STATISTIC_TYPES,
  WIDGET_COLORS,
  WIDGET_STYLES,
} from '@/constants'

export type WidgetStyle = (typeof WIDGET_STYLES)[number]

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

export interface LayoutConfig {
  horizontalAlignment: 'left' | 'center' | 'right'
  size: 'small' | 'medium' | 'large' | 'full-width'
  justifyContent: 'start' | 'center' | 'end'
}

export interface WidgetParams {
  version?: 'v2'
}

export interface CartWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  order: StoreOrder
  withPopup?: boolean
  style?: WidgetStyle
}

export interface SpendLevelWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  currency: string
  withPopup?: boolean
  style?: WidgetStyle
}

export interface PerOrderWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  currency: string
  withPopup?: boolean
  style?: WidgetStyle
}

export interface ByPercentageWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  withPopup?: boolean
  style?: WidgetStyle
}

export interface TieredSpendLevelWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  currency: string
  withPopup?: boolean
  style?: WidgetStyle
}

export interface PerProductWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  productId: string
  withPopup?: boolean
  style?: WidgetStyle
}

export interface TopStatsWidgetParams extends WidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  withPopup?: boolean
}

export interface FullWidthBannerWidgetParams extends WidgetParams {
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
