export interface WooCommerceConfig {
  integrationSlug: string
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
