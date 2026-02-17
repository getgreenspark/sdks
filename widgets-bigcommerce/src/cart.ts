import {log} from './debug'
import type {BigCommerceCart, BigCommerceConfig} from './interfaces'

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

  function getCart(): Promise<BigCommerceCart> {
    const url = `${baseUrl}/api/storefront/carts`
    log('cart: getCart() fetching', url)
    return fetchJSON<{
      id: string
      lineItems?: { productId: number; quantity: number }[]
      currency?: string
      cartAmount?: number
    }>(url).then((data) => {
      const cart = {
        items: (data.lineItems ?? []).map((item) => ({
          productId: String(item.productId),
          quantity: item.quantity,
          id: undefined,
        })),
        currency: data.currency ?? currency ?? 'USD',
        total_price: data.cartAmount ?? 0,
      }
      log('cart: getCart() response', data, cart.items.length, 'items')
      return cart
    })
  }

  function addItemToCart(targetProductId: string, quantity = 1): Promise<unknown> {
    const cartId = cfg.cartId ?? getCartIdFromCookie()
    if (!cartId) {
      return fetch(`${baseUrl}/api/storefront/carts`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lineItems: [{productId: Number(targetProductId), quantity}]}),
      })
        .then((r) => r.json())
        .then((cart: { id?: string }) => {
          if (cart.id) setCartIdCookie(cart.id)
          return cart
        })
        .catch((err) => {
          captureEvent(err).catch(() => {
          })
          return Promise.reject(err)
        })
    }
    return fetch(`${baseUrl}/api/storefront/carts/${cartId}/items`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify([{productId: Number(targetProductId), quantity}]),
    }).catch((err) => {
      captureEvent(err).catch(() => {
      })
      return Promise.reject(err)
    })
  }

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
