/**
 * Config injected by the app or widget template (script tag / data attributes).
 * Set window.GreensparkBigCommerceConfig before the script runs, or the script
 * reads from data attributes on the script tag / root widget container.
 */
export interface BigCommerceConfig {
  /** Store identifier used as integrationSlug (e.g. store hash from OAuth). */
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

/**
 * Cart item shape from BigCommerce Storefront API or Stencil cart.
 */
export interface BigCommerceCartLineItem {
  productId: string
  quantity: number
  id?: string
}

/**
 * Cart shape we pass to GreensparkWidgets (same as Shopify adapter).
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
