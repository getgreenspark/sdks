import type {
  AVAILABLE_LOCALES,
  AVAILABLE_STATISTIC_TYPES,
  WIDGET_COLORS,
  WIDGET_STYLES,
} from '@/constants'

export type WidgetStyle = (typeof WIDGET_STYLES)[number]

type ApiSettingsBase = {
  apiKey: string
  locale?: (typeof AVAILABLE_LOCALES)[number]
  isShopifyIntegration?: boolean
}

export type ApiSettings = ApiSettingsBase &
  (Partial<ExternalShopContextV1> | Partial<ExternalShopContextV2>)

interface ExternalShopContextV1 {
  shopUniqueName: string
  integrationSlug?: never
}

interface ExternalShopContextV2 {
  shopUniqueName?: never
  integrationSlug: string
}

export type ExternalShopContext = ExternalShopContextV1 | ExternalShopContextV2

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

export interface PerPurchaseWidgetParams {
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

export interface ByPercentageOfRevenueWidgetParams extends WidgetParams {
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
  callToActionUrl?: string
}

export type CartWidgetRequestBody = ExternalShopContext & CartWidgetParams
export type SpendLevelRequestBody = ExternalShopContext & SpendLevelWidgetParams
export type PerOrderRequestBody = ExternalShopContext & PerOrderWidgetParams
export type PerPurchaseRequestBody = ExternalShopContext & PerPurchaseWidgetParams
export type ByPercentageRequestBody = ExternalShopContext & ByPercentageWidgetParams
export type ByPercentageOfRevenueRequestBody = ExternalShopContext & ByPercentageOfRevenueWidgetParams
export type TieredSpendLevelRequestBody = ExternalShopContext & TieredSpendLevelWidgetParams
export type PerProductRequestBody = ExternalShopContext & PerProductWidgetParams
export type TopStatsRequestBody = TopStatsWidgetParams
export type FullWidthBannerRequestBody = FullWidthBannerWidgetParams
