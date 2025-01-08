export interface Shopify {
  shop: string
  locale: string
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
