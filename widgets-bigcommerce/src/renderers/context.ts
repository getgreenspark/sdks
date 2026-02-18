import type { CartOrderPayload } from '../interfaces'

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
