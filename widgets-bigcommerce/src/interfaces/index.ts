export interface BigCommerceConfig {
  /** Store identifier (from data-integration-slug on the widget target div). */
  integrationSlug: string
  productId?: string
  currency?: string
  locale?: string
}


/** Cart currency object in Storefront API responses. */
export interface StorefrontCartCurrency {
  code?: string

  [key: string]: unknown
}

/** Single line item in Storefront API (physical/digital item with productId). */
export interface StorefrontCartLineItem {
  id?: string
  productId?: number
  quantity: number

  [key: string]: unknown
}

/** Cart response lineItems is an object with physicalItems, digitalItems, etc. */
export interface StorefrontCartLineItems {
  physicalItems?: StorefrontCartLineItem[]
  digitalItems?: StorefrontCartLineItem[]
  giftCertificates?: unknown[]
  customItems?: StorefrontCartLineItem[]

  [key: string]: unknown
}

/** Cart object returned by GET /carts and POST /carts (and related endpoints).
 * BigCommerce REST Storefront API types (https://developer.bigcommerce.com/docs/rest-storefront/carts)
 * */
export interface StorefrontCartResponse {
  id: string
  customerId?: number
  email?: string
  currency?: StorefrontCartCurrency
  isTaxIncluded?: boolean
  baseAmount?: number
  discountAmount?: number
  cartAmount?: number
  coupons?: unknown[]
  discounts?: unknown[]
  lineItems?: StorefrontCartLineItems
  createdTime?: string
  updatedTime?: string
  locale?: string
  version?: number
}


export interface CartOrderPayload {
  lineItems: { productId: string; quantity: number }[]
  currency: string
  totalPrice: number
}

type WIDGET_VARIANTS =
  | 'orderImpacts'
  | 'offsetPerOrder'
  | 'offsetByProduct'
  | 'offsetBySpend'
  | 'offsetByStoreRevenue'
  | 'byPercentage'
  | 'byPercentageOfRevenue'
  | 'stats'
  | 'static'
  | 'banner'

export const EnumToWidgetTypeMap: Record<string, WIDGET_VARIANTS> = {
  '0': 'orderImpacts',
  '1': 'offsetPerOrder',
  '2': 'offsetByProduct',
  '3': 'offsetBySpend',
  '4': 'offsetByStoreRevenue',
  '5': 'byPercentage',
  '6': 'byPercentageOfRevenue',
  '7': 'stats',
  '8': 'static',
  '9': 'banner',
} as const
