import { err } from './debug'
import { getStoreApiBase } from './config'
import type { CartOrderPayload } from './interfaces'

interface WCStoreCartItemPrices {
  price?: string
  regular_price?: string
  sale_price?: string
  currency_code?: string
}

interface WCStoreCartItem {
  id: number
  quantity: number
  name?: string
  prices?: WCStoreCartItemPrices
  extensions?: Record<string, unknown>
}

interface WCStoreCartTotals {
  total_price?: string
  currency_code?: string
}

interface WCStoreCartResponse {
  items?: WCStoreCartItem[]
  totals?: WCStoreCartTotals
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) return Promise.reject(res)
  return res.json() as Promise<T>
}

export function createCartApi() {
  function toLineItems(items: WCStoreCartItem[]): CartOrderPayload['lineItems'] {
    return items.map((item) => ({
      productId: String(item.id ?? ''),
      quantity: item.quantity,
    }))
  }

  async function getCart(): Promise<CartOrderPayload> {
    const base = getStoreApiBase()
    try {
      const data = await fetchJSON<WCStoreCartResponse>(`${base}/cart`)
      const items = data.items ?? []
      const lineItems = toLineItems(items)
      const currency = data.totals?.currency_code ?? ''
      const rawTotal = data.totals?.total_price ?? '0'
      const totalPrice = parseInt(rawTotal, 10) || 0
      return { lineItems, currency, totalPrice }
    } catch (e) {
      err('cart: getCart failed', e)
      return { lineItems: [], currency: '', totalPrice: 0 }
    }
  }

  return { getCart }
}
