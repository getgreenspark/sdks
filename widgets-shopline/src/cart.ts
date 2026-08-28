import type { CartApi, CartOrderPayload, ShoplineCart, ShoplineCartItem } from './interfaces'
import { getGreensparkApiUrl } from './config'
import { err } from './debug'

const CART_ENDPOINTS = {
  get: '/api/carts/ajax-cart',
  add: '/cart/add',
  update: '/cart/update',
} as const

/** Query-cart-details marks Content-Type application/json as required, including GET. */
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as const

/** SKU ids are long decimal strings; never coerce with parseInt. */
export function skuIdOf(item: ShoplineCartItem): string {
  if (item.id != null) return String(item.id)
  if (item.variant_id != null) return String(item.variant_id)
  if (item.sku != null) return String(item.sku)
  return ''
}

export function parseCart(cart: ShoplineCart): CartOrderPayload {
  const lineItems = cart.items.map((item) => ({
    productId: String(item.product_id != null ? item.product_id : skuIdOf(item)),
    quantity: item.quantity,
  }))

  return {
    lineItems,
    currency: cart.currency,
    totalPrice: cart.total_price,
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
    total_price: typeof totalPrice === 'number' && !Number.isNaN(totalPrice) ? totalPrice : 0,
  }
}

function dispatchCartRefresh(): void {
  const center = window.themeEventCenter
  const ThemeEvent = window.ThemeEvent
  if (!center || typeof center.dispatch !== 'function' || !ThemeEvent) return

  center.dispatch(new ThemeEvent('cart:open', { detail: { refresh: true } }))
}

export function createCartApi(shopUniqueName: string): CartApi {
  const greensparkApiUrl = getGreensparkApiUrl(shopUniqueName)

  function captureEvent(event: unknown): Promise<Response> {
    return fetch(`${greensparkApiUrl}/v2/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        integrationSlug: shopUniqueName,
        scope: 'CUSTOMER_CART_CONTRIBUTION_WIDGET',
        type: 'ERROR',
        event,
      }),
    })
  }

  function getCart(): Promise<ShoplineCart> {
    return fetchJSON<ShoplineAjaxCart>(CART_ENDPOINTS.get, {
      method: 'GET',
      headers: JSON_HEADERS,
    }).then(toShoplineCart)
  }

  function getOrder(): Promise<CartOrderPayload> {
    return getCart().then(parseCart)
  }

  function addItemToCart(targetProductId: string, quantity = 1): Promise<unknown> {
    return fetchJSON(CART_ENDPOINTS.add, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ items: [{ id: targetProductId, quantity }] }),
    }).catch((error: unknown) => {
      if (error instanceof Response) {
        error
          .json()
          .then((jsonError: unknown) => captureEvent(jsonError))
          .catch((jsonError: unknown) => err('cart: failed to capture add error', jsonError))
      }
      return Promise.reject(error)
    })
  }

  function updateCart(updates: Record<string, number>): Promise<Response | undefined> {
    const entries = Object.entries(updates)
    if (entries.length === 0) return Promise.resolve(undefined)

    return entries
      .reduce<Promise<Response | undefined>>(
        (chain, [id, quantity]) =>
          chain.then(() =>
            fetch(CART_ENDPOINTS.update, {
              method: 'POST',
              credentials: 'same-origin',
              headers: JSON_HEADERS,
              body: JSON.stringify({ id, quantity }),
            }),
          ),
        Promise.resolve(undefined),
      )
      .then((response) => {
        if (response && !response.ok) return Promise.reject(response)
        return response
      })
  }

  function refreshCartDrawer(): void {
    try {
      dispatchCartRefresh()
    } catch (error: unknown) {
      err('cart: Error refreshing cart UI:', error)
    }
  }

  return {
    getCart,
    getOrder,
    addItemToCart,
    updateCart,
    refreshCartDrawer,
    captureEvent,
  }
}
