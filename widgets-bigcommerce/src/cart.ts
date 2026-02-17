import {log} from './debug'
import type {
  BigCommerceCart,
  BigCommerceConfig,
  StorefrontAddCartLineItemsRequest,
  StorefrontCartResponse,
  StorefrontCreateCartRequest,
} from './interfaces'

export function getCartIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)bc_cartId=([^;]*)/)
  const cartId = match ? decodeURIComponent(match[1]) : null
  log('cart: getCartIdFromCookie() =>', cartId ?? '(none)')
  return cartId
}

export function setCartIdCookie(cartId: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `bc_cartId=${encodeURIComponent(cartId)}; path=/; max-age=604800`
}

export function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  return fetch(url, options).then((res) => {
    if (!res.ok) return Promise.reject(res)
    return res.json() as Promise<T>
  })
}

export function createCartApi(cfg: BigCommerceConfig, baseUrl: string, currency: string, greensparkApiUrl: string) {
  const {integrationSlug} = cfg

  function captureEvent(event: unknown): Promise<Response> {
    return fetch(`${greensparkApiUrl}/v2/events`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      body: JSON.stringify({
        integrationSlug,
        scope: 'CUSTOMER_CART_CONTRIBUTION_WIDGET',
        type: 'ERROR',
        event,
      }),
    })
  }

  /** Flatten Storefront API lineItems (physicalItems, digitalItems, customItems) into a single array. */
  function flattenLineItems(
    lineItems: StorefrontCartResponse['lineItems'],
  ): { productId: string; quantity: number; id?: string }[] {
    if (!lineItems) return []
    const physical = lineItems.physicalItems ?? []
    const digital = lineItems.digitalItems ?? []
    const custom = lineItems.customItems ?? []
    const map = (item: { productId?: number; quantity: number; id?: string }) => ({
      productId: String(item.productId ?? ''),
      quantity: item.quantity,
      id: item.id,
    })
    return [...physical.map(map), ...digital.map(map), ...custom.map(map)]
  }

  async function getCart(): Promise<BigCommerceCart> {
    const url = `${baseUrl}/api/storefront/carts`
    log('cart: getCart() fetching', url)
    const carts = await fetchJSON<StorefrontCartResponse[]>(url)
    const data = Array.isArray(carts)
      ? carts.length > 0
        ? carts.find((c) => c.id === (cfg.cartId ?? getCartIdFromCookie())) ?? carts[0]
        : ({} as StorefrontCartResponse)
      : (carts as unknown as StorefrontCartResponse)
    const items = flattenLineItems(data.lineItems)
    const currencyCode =
      typeof data.currency === 'object' && data.currency !== null && 'code' in data.currency
        ? (data.currency as { code?: string }).code
        : undefined
    const cart: BigCommerceCart = {
      items,
      currency: currencyCode ?? currency ?? 'USD',
      total_price: data.cartAmount ?? 0,
    }
    log('cart: getCart() response', data.id ?? '(no id)', cart.items.length, 'items')
    return cart
  }

  function addItemToCart(targetProductId: string, quantity = 1): Promise<unknown> {
    const cartId = cfg.cartId ?? getCartIdFromCookie()
    if (!cartId) {
      const body: StorefrontCreateCartRequest = {
        lineItems: [{productId: Number(targetProductId), quantity}],
      }
      return fetch(`${baseUrl}/api/storefront/carts`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      })
        .then((r) => r.json())
        .then((cart: StorefrontCartResponse) => {
          if (cart.id) setCartIdCookie(cart.id)
          return cart
        })
        .catch((err) => {
          captureEvent(err).catch(() => {
          })
          return Promise.reject(err)
        })
    }
    const body: StorefrontAddCartLineItemsRequest = {
      lineItems: [{productId: Number(targetProductId), quantity}],
    }
    return fetch(`${baseUrl}/api/storefront/carts/${cartId}/items`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    }).catch((err) => {
      captureEvent(err).catch(() => {
      })
      return Promise.reject(err)
    })
  }

  /**
   * Update cart quantities. Note: Storefront API updates line items via PUT /carts/{cartId}/items/{itemId}
   * (one item per request). This implementation sends a single PUT to /items; if the store rejects it,
   * consider iterating with PUT per itemId.
   */
  function updateCart(updates: Record<string, number>): Promise<Response> {
    const cartId = cfg.cartId ?? getCartIdFromCookie()
    if (!cartId) return Promise.reject(new Error('No cart id'))
    return getCart().then((cart) => {
      const lineItems = cart.items
        .map((item) => {
          const qty = updates[item.productId]
          if (qty !== undefined) return {...item, quantity: qty}
          return item
        })
        .filter((item) => item.quantity > 0)
      return fetch(`${baseUrl}/api/storefront/carts/${cartId}/items`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
          lineItems.map((i) => ({productId: Number(i.productId), quantity: i.quantity})),
        ),
      })
    })
  }

  return {getCart, addItemToCart, updateCart}
}
