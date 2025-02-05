import type {
  AVAILABLE_LOCALES,
  AVAILABLE_STATISTIC_TYPES,
  IMPACT_TYPES,
  WIDGET_COLORS,
  WIDGET_STYLES,
  POPUP_THEMES,
} from '@/constants'

export type WidgetStyle = (typeof WIDGET_STYLES)[number]
export type PopupTheme = (typeof POPUP_THEMES)[number]

type ApiSettingsBase = {
  apiKey?: string
  locale?: (typeof AVAILABLE_LOCALES)[number]
  isShopifyIntegration?: boolean
}

type WidgetPopupParams = {
  withPopup?: boolean
  popupTheme?: PopupTheme
}

type WidgetStyleParams = {
  color: (typeof WIDGET_COLORS)[number]
  style?: WidgetStyle
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

export interface CartWidgetParams extends WidgetParams, WidgetPopupParams, WidgetStyleParams {
  order: StoreOrder
}

export interface SpendLevelWidgetParams extends WidgetParams, WidgetPopupParams, WidgetStyleParams {
  currency: string
}

export interface PerOrderWidgetParams extends WidgetParams, WidgetPopupParams, WidgetStyleParams {
  currency: string
}

export interface PerPurchaseWidgetParams extends WidgetPopupParams, WidgetStyleParams {
  currency: string
}

export interface ByPercentageWidgetParams
  extends WidgetParams,
    WidgetPopupParams,
    WidgetStyleParams {}

export interface ByPercentageOfRevenueWidgetParams
  extends WidgetParams,
    WidgetPopupParams,
    WidgetStyleParams {}

export interface TieredSpendLevelWidgetParams
  extends WidgetParams,
    WidgetPopupParams,
    WidgetStyleParams {
  currency: string
}

export interface PerProductWidgetParams extends WidgetParams, WidgetPopupParams, WidgetStyleParams {
  productId?: string
}

export interface TopStatsWidgetParams extends WidgetParams, WidgetPopupParams {
  color: (typeof WIDGET_COLORS)[number]
  impactTypes?: (typeof IMPACT_TYPES)[number][]
}

export interface FullWidthBannerWidgetParams extends WidgetParams {
  options: Array<(typeof AVAILABLE_STATISTIC_TYPES)[number]>
  imageUrl?: string
  title?: string
  description?: string
  callToActionUrl?: string
  textColor?: string
  buttonBackgroundColor?: string
  buttonTextColor?: string
}

export type CartWidgetRequestBody = ExternalShopContext & CartWidgetParams
export type SpendLevelRequestBody = ExternalShopContext & SpendLevelWidgetParams
export type PerOrderRequestBody = ExternalShopContext & PerOrderWidgetParams
export type PerPurchaseRequestBody = ExternalShopContext & PerPurchaseWidgetParams
export type ByPercentageRequestBody = ExternalShopContext & ByPercentageWidgetParams
export type ByPercentageOfRevenueRequestBody = ExternalShopContext &
  ByPercentageOfRevenueWidgetParams
export type TieredSpendLevelRequestBody = ExternalShopContext & TieredSpendLevelWidgetParams
export type PerProductRequestBody = ExternalShopContext & PerProductWidgetParams
export type TopStatsRequestBody = TopStatsWidgetParams
export type FullWidthBannerRequestBody = FullWidthBannerWidgetParams
