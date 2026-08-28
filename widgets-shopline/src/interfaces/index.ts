export interface ShoplineCartItem {
  product_id?: string | number
  variant_id?: string | number
  id?: string | number
  sku?: string
  quantity: number
}

export interface ShoplineCart {
  items: ShoplineCartItem[]
  currency: string
  total_price: number
}

export interface CartOrderPayload {
  lineItems: { productId: string; quantity: number }[]
  currency: string
  totalPrice: number
}

export interface CartApi {
  getCart: () => Promise<ShoplineCart>
  getOrder: () => Promise<CartOrderPayload | undefined>
}

export interface RunContext {
  greenspark: InstanceType<Window['GreensparkWidgets']>
  cartApi: CartApi
  getWidgetContainer: (target: HTMLElement) => string
  movePopupToBody: (target: HTMLElement) => void
  clearWidgetMount: (target: HTMLElement) => void
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
