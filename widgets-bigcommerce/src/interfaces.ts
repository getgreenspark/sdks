export interface BigCommerceConfig {
  integrationSlug: string
}

/** Cart currency object in Storefront API responses. */
export interface StorefrontCartCurrency {
  code: string
  symbol: string
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
}

/** Cart object returned by GET /carts and POST /carts (and related endpoints).
 * @see https://developer.bigcommerce.com/docs/rest-storefront/carts#get-a-cart
 * Currency is always present on the Cart per API docs ("This will always be the same between cart and checkout").
 */
export interface StorefrontCartResponse {
  id: string
  customerId?: number
  email?: string
  currency: StorefrontCartCurrency
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

export interface CartApi {
  getCart: () => Promise<CartOrderPayload>
}

export interface RunContext {
  greenspark: InstanceType<Window['GreensparkWidgets']>
  cartApi: CartApi
  getWidgetContainer: (widgetId: string) => string
  movePopupToBody: (widgetId: string) => void
  productId: string
  currency: string
  useShadowDom: boolean
  version: 'v2'
}

export type WidgetVariant =
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

export const EnumToWidgetTypeMap: Record<string, WidgetVariant> = {
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
