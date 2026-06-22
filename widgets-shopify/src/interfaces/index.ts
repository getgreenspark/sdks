export interface Shopify {
  shop: string
  locale: string
  currency: {
    active: string
  }
  routes?: {
    root: string
  }
}

export interface ShopifyAnalytics {
  meta: {
    product: {
      id: number
    }
  }
}

export interface ShopifyCartItem {
  product_id: string
  quantity: number
  id?: string | number
}

export interface ShopifyCart {
  items: ShopifyCartItem[]
  currency: string
  total_price: number
}

export interface CartOrderPayload {
  lineItems: { productId: string; quantity: number }[]
  currency: string
  totalPrice: number
}

export interface CartApi {
  getCart: () => Promise<ShopifyCart>
  getOrder: () => Promise<CartOrderPayload>
  addItemToCart: (targetProductId: string, quantity?: number) => Promise<unknown>
  updateCart: (updates: Record<string, number>) => Promise<Response>
  refreshCartDrawer: () => void
  captureEvent: (event: unknown) => Promise<Response>
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
  '0' : 'orderImpacts',
  '1' : 'offsetPerOrder',
  '2' : 'offsetByProduct',
  '3' : 'offsetBySpend',
  '4' : 'offsetByStoreRevenue',
  '5' : 'byPercentage',
  '6' : 'byPercentageOfRevenue',
  '7' : 'stats',
  '8' : 'static',
  '9' : 'banner',
} as const
