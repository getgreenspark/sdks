import { AVAILABLE_LOCALES, AVAILABLE_STORE_CURRENCIES, WIDGET_COLORS } from '@/constants'

export interface ApiSettings {
  apiKey: string
  locale?: (typeof AVAILABLE_LOCALES)[number]
  shopUniqueName: string
}

export interface ApiRequestBody {
  shopUniqueName: string
}

export interface OrderProduct {
  productId: string
  quantity: number
}

export interface StoreOrder {
  currency: (typeof AVAILABLE_STORE_CURRENCIES)[number]
  totalPrice: number
  lineItems: Array<OrderProduct>
}

export interface CartWidgetParams {
  color: (typeof WIDGET_COLORS.cart)[number]
  order: StoreOrder
  withPopup?: boolean
}

export interface CartWidgetRequestBody extends ApiRequestBody, CartWidgetParams {}
