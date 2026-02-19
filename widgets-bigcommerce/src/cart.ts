import type { CartOrderPayload, StorefrontCartResponse } from './interfaces'

export async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  return fetch(url, options).then((res) => {
    if (!res.ok) return Promise.reject(res)
    return res.json() as Promise<T>
  })
}

export function createCartApi(baseUrl: string) {
  /** Flatten Storefront API lineItems into widget payload lineItems. */
  function toLineItems(lineItems: StorefrontCartResponse['lineItems']): CartOrderPayload['lineItems'] {
    if (!lineItems) return []
    const physical = lineItems.physicalItems ?? []
    const digital = lineItems.digitalItems ?? []
    const custom = lineItems.customItems ?? []
    const map = (item: { productId?: number; quantity: number }) => ({
      productId: String(item.productId ?? ''),
      quantity: item.quantity,
    })
    return [...physical.map(map), ...digital.map(map), ...custom.map(map)]
  }

  async function getCart(): Promise<CartOrderPayload> {
    const url = `${baseUrl}/api/storefront/carts`
    const carts = await fetchJSON<StorefrontCartResponse[]>(url)
    const data = Array.isArray(carts)
      ? carts.length > 0
        ? carts[0]
        : ({} as StorefrontCartResponse)
      : (carts as unknown as StorefrontCartResponse)
    const lineItems = toLineItems(data.lineItems)
    const hasCartWithCurrency = data?.currency?.code != null
    const order: CartOrderPayload = {
      lineItems,
      currency: hasCartWithCurrency ? (data.currency!.code ?? '') : '',
      totalPrice: data?.cartAmount ?? 0,
    }
    return order
  }

  return { getCart }
}
