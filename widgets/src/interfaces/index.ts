import type {
  AVAILABLE_STATISTIC_TYPES,
  IMPACT_TYPES,
  WIDGET_STYLES,
  POPUP_THEMES,
  STATIC_WIDGET_STYLES,
  WIDGET_COLORS,
} from '@/constants'

export type WidgetStyle = (typeof WIDGET_STYLES)[number]
export type StaticWidgetStyle = (typeof STATIC_WIDGET_STYLES)[number]
export type PopupTheme = (typeof POPUP_THEMES)[number]
export type WidgetColor = (typeof WIDGET_COLORS)[number]

type ApiSettingsBase = {
  apiKey?: string
  locale?: string
  isShopifyIntegration?: boolean
}

type WidgetPopupParams = {
  withPopup?: boolean
  popupTheme?: PopupTheme
}

type WidgetStyleParams = {
  color: WidgetColor
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

export interface WidgetByIdParams {
  widgetId: string
}

export interface WidgetCurrencyParams {
  currency: string
}

export interface CartWidgetBaseParams {
  order: StoreOrder
}

export interface CartWidgetParams
  extends CartWidgetBaseParams,
    WidgetParams,
    WidgetPopupParams,
    WidgetStyleParams {}

export interface CartWidgetByIdParams
  extends WidgetParams,
    WidgetByIdParams,
    CartWidgetBaseParams {}

export interface SpendLevelWidgetParams
  extends WidgetCurrencyParams,
    WidgetParams,
    WidgetPopupParams,
    WidgetStyleParams {}

export interface SpendLevelWidgetByIdParams
  extends WidgetParams,
    WidgetByIdParams,
    WidgetCurrencyParams {}

export interface PerOrderWidgetParams extends WidgetParams, WidgetPopupParams, WidgetStyleParams {}

export interface PerOrderWidgetByIdParams extends WidgetByIdParams, WidgetParams {}

export interface PerPurchaseWidgetParams extends WidgetPopupParams, WidgetStyleParams {}

export interface ByPercentageWidgetParams
  extends WidgetParams,
    WidgetPopupParams,
    WidgetStyleParams {}

export interface ByPercentageWidgetByIdParams extends WidgetByIdParams, WidgetParams {}

export interface ByPercentageOfRevenueWidgetParams
  extends WidgetParams,
    WidgetPopupParams,
    WidgetStyleParams {}

export interface ByPercentageOfRevenueWidgetByIdParams extends WidgetByIdParams, WidgetParams {}

export interface TieredSpendLevelWidgetParams
  extends WidgetParams,
    WidgetPopupParams,
    WidgetStyleParams {
  currency: string
}

export interface TieredSpendLevelWidgetByIdParams extends WidgetParams, WidgetByIdParams {
  currency: string
}

export interface PerProductWidgetParams extends WidgetParams, WidgetPopupParams, WidgetStyleParams {
  productId?: string
}

export interface PerProductWidgetByIdParams extends WidgetByIdParams, WidgetParams {
  productId?: string
}

export interface TopStatsWidgetParams extends WidgetParams, WidgetPopupParams {
  color: WidgetColor
  impactTypes?: (typeof IMPACT_TYPES)[number][]
}

export interface StaticWidgetParams extends WidgetParams {
  color: WidgetColor
  style?: StaticWidgetStyle
}

export interface StaticWidgetByIdParams extends WidgetByIdParams, WidgetParams {}

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
export type CartWidgetByIdRequestBody = ExternalShopContext & CartWidgetByIdParams
export type SpendLevelRequestBody = ExternalShopContext & SpendLevelWidgetParams
export type SpendLevelWidgetByIdRequestBody = ExternalShopContext & SpendLevelWidgetByIdParams
export type PerOrderRequestBody = ExternalShopContext & PerOrderWidgetParams
export type PerOrderByIdRequestBody = ExternalShopContext & PerOrderWidgetByIdParams
export type PerPurchaseRequestBody = ExternalShopContext & PerPurchaseWidgetParams
export type ByPercentageRequestBody = ExternalShopContext & ByPercentageWidgetParams
export type ByPercentageWidgetByIdRequestBody = ExternalShopContext & ByPercentageWidgetByIdParams
export type ByPercentageOfRevenueRequestBody = ExternalShopContext &
  ByPercentageOfRevenueWidgetParams
export type ByPercentageOfRevenueWidgetByIdRequestBody = ExternalShopContext &
  ByPercentageOfRevenueWidgetByIdParams
export type TieredSpendLevelRequestBody = ExternalShopContext & TieredSpendLevelWidgetParams
export type TieredSpendLevelByIdRequestBody = ExternalShopContext & TieredSpendLevelWidgetByIdParams
export type PerProductRequestBody = ExternalShopContext & PerProductWidgetParams
export type PerProductByIdRequestBody = ExternalShopContext & PerProductWidgetByIdParams
export type TopStatsRequestBody = TopStatsWidgetParams
export type FullWidthBannerRequestBody = FullWidthBannerWidgetParams
