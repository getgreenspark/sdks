/**
 * Config discovered from the page and widget target div(s).
 * integrationSlug comes from .greenspark-widget-target[data-integration-slug].
 * Optional overrides (currency, locale, etc.) via window.GreensparkBigCommerceConfig.
 */
export interface BigCommerceConfig {
  /** Store identifier (from data-integration-slug on the widget target div). */
  integrationSlug: string
  /** Current product id on PDP (for per-product widgets). */
  productId?: string
  /** Store currency code (e.g. USD). */
  currency?: string
  /** Locale (e.g. en). */
  locale?: string
  /** Base URL for Storefront API (e.g. store’s origin). Omitted if using same-origin. */
  storefrontApiBase?: string
  /** Cart id for Storefront API (cookie or from Stencil). Optional if cart is read from Stencil global. */
  cartId?: string
}

// --- BigCommerce REST Storefront API types (https://developer.bigcommerce.com/docs/rest-storefront/carts) ---

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

/** Cart object returned by GET /carts and POST /carts (and related endpoints). */
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

/** Request body for POST /carts (create cart). */
export interface StorefrontCreateCartRequest {
  lineItems: StorefrontAddCartLineItem[]
  locale?: string
}

/** Request body for POST /carts/{cartId}/items (add line items). */
export interface StorefrontAddCartLineItemsRequest {
  lineItems: StorefrontAddCartLineItem[]
  version?: number
}

/** Line item shape when adding to cart (productId + quantity required). */
export interface StorefrontAddCartLineItem {
  productId: number
  quantity: number
  optionSelections?: unknown[]
  giftWrapping?: unknown
}

/**
 * Normalized cart item shape we use internally (from Storefront API or Stencil).
 */
export interface BigCommerceCartLineItem {
  productId: string
  quantity: number
  id?: string
}

/**
 * Normalized cart shape we pass to GreensparkWidgets (same as Shopify adapter).
 */
export interface BigCommerceCart {
  items: BigCommerceCartLineItem[]
  currency: string
  total_price: number
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
