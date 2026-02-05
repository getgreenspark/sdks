import type { BigCommerceCart } from '../interfaces'

export interface CartApi {
  getCart: () => Promise<BigCommerceCart>
  addItemToCart: (productId: string, quantity?: number) => Promise<unknown>
  updateCart: (updates: Record<string, number>) => Promise<Response>
}

export interface RunContext {
  greenspark: InstanceType<Window['GreensparkWidgets']>
  cartApi: CartApi
  parseCart: (cart: BigCommerceCart) => { lineItems: { productId: string; quantity: number }[]; currency: string; totalPrice: number }
  getWidgetContainer: (widgetId: string) => string
  movePopupToBody: (widgetId: string) => void
  productId: string
  currency: string
  useShadowDom: boolean
  version: 'v2'
  refreshCartUI: () => void
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
