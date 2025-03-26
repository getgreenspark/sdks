export interface Shopify {
  shop: string
  locale: string
  currency: {
    active: string
  }
}

export interface ShopifyCartItem {
  product_id: string
  quantity: number
}

export interface ShopifyCart {
  items: ShopifyCartItem[]
  currency: string
  total_price: number
}

type WIDGET_VARIANTS =
  | 'byPercentage'
  | 'byPercentageOfRevenue'
  | 'cart'
  | 'fullWidthBanner'
  | 'perOrder'
  | 'perProduct'
  | 'spendLevel'
  | 'tieredSpendLevel'
  | 'topStats'

export const WidgetType: Record<string, WIDGET_VARIANTS> = {
  '0' : 'cart',
  '1' : 'perOrder',
} as const
