import type { CartApi, CartOrderPayload, ShoplineCart, ShoplineCartItem } from './interfaces'
import { parseCurrency } from './config'

const CART_GET = '/api/carts/ajax-cart'

/** Query-cart-details marks Content-Type application/json as required, including GET. */
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as const

/**
 * ajax-cart `total_price` is major units (docs sample: 11);
 * widget-api `totalPrice` is always cents (backend divides by 100).
 */
export function toCents(amount: number | undefined): number {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return 0
  return Math.round(amount * 100)
}

/** Prefer product_id; never sku. SHOPLINE ids overflow JS numbers — keep strings. */
export function lineProductId(item: ShoplineCartItem): string {
  if (item.product_id != null) return String(item.product_id)
  if (item.variant_id != null) return String(item.variant_id)
  if (item.id != null) return String(item.id)
  return ''
}

export function parseCart(cart: ShoplineCart): CartOrderPayload | undefined {
  const currency = parseCurrency(cart.currency)
  if (!currency) return undefined

  return {
    lineItems: cart.items.map((item) => ({
      productId: lineProductId(item),
      quantity: item.quantity,
    })),
    currency,
    totalPrice: toCents(cart.total_price),
  }
}

function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  return fetch(url, { credentials: 'same-origin', ...options }).then((response) => {
    if (!response.ok) return Promise.reject(response)
    return response.json() as Promise<T>
  })
}

interface ShoplineAjaxCart {
  items?: ShoplineCartItem[]
  currency?: string
  total_price?: number
}

function toShoplineCart(cart: ShoplineAjaxCart | undefined): ShoplineCart {
  const totalPrice = cart?.total_price
  return {
    items: cart?.items ?? [],
    currency: cart?.currency ? cart.currency : '',
    total_price: typeof totalPrice === 'number' && Number.isFinite(totalPrice) ? totalPrice : 0,
  }
}

export function createCartApi(): CartApi {
  function getCart(): Promise<ShoplineCart> {
    return fetchJSON<ShoplineAjaxCart>(CART_GET, {
      method: 'GET',
      headers: JSON_HEADERS,
    }).then(toShoplineCart)
  }

  function getOrder(): Promise<CartOrderPayload | undefined> {
    return getCart().then(parseCart)
  }

  return { getCart, getOrder }
}
