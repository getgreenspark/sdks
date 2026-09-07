import type { CartApi, CartOrderPayload, ShoplineCart, ShoplineCartItem } from './interfaces'
import { parseCurrency } from './config'

const CART_GET = '/api/carts/ajax-cart'

/** Query-cart-details marks Content-Type application/json as required, including GET. */
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as const

/**
 * ajax-cart money/qty may be a Double or a quoted JSON string.
 * Same idea as Hotglue `parseMoneyString` — never substitute 0 for garbage.
 */
export function parseMajorUnits(value: unknown): number | undefined {
  if (value == null || value === '') return undefined
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value).trim())
  if (!Number.isFinite(parsed) || parsed < 0) return undefined
  return parsed
}

function parseQuantity(value: unknown): number | undefined {
  const parsed = parseMajorUnits(value)
  if (parsed === undefined || parsed <= 0) return undefined
  return parsed
}

/**
 * ajax-cart `total_price` is major units (docs sample: 11);
 * widget-api `totalPrice` is always cents (backend divides by 100).
 */
export function toCents(amount: unknown): number | undefined {
  const major = parseMajorUnits(amount)
  if (major === undefined) return undefined
  return Math.round(major * 100)
}

/**
 * Hotglue platformProductId is product_id only; variant_id must not spoof it.
 * SHOPLINE ids overflow JS numbers — keep strings. Never sku.
 */
export function lineProductId(item: ShoplineCartItem): string {
  if (item.product_id == null || item.product_id === '') return ''
  return String(item.product_id)
}

export function parseCart(cart: ShoplineCart): CartOrderPayload | undefined {
  const currency = parseCurrency(cart.currency)
  if (!currency) return undefined

  const lineItems = cart.items
    .map((item) => {
      const productId = lineProductId(item)
      const quantity = parseQuantity(item.quantity)
      if (!productId || quantity === undefined) return undefined
      return { productId, quantity }
    })
    .filter((line): line is { productId: string; quantity: number } => line != null)

  const totalPrice = toCents(cart.total_price)
  // Items + unparseable total → skip (do not paint $0). Empty cart may omit total.
  if (totalPrice === undefined) {
    if (lineItems.length === 0) {
      return { lineItems, currency, totalPrice: 0 }
    }
    return undefined
  }

  return { lineItems, currency, totalPrice }
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
  total_price?: number | string
}

function toShoplineCart(cart: ShoplineAjaxCart | undefined): ShoplineCart {
  return {
    items: cart?.items ?? [],
    currency: cart?.currency ? cart.currency : '',
    // Pass through quoted totals; parseCart coerces. Do not default to 0.
    total_price: cart?.total_price,
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
