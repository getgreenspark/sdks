import type { CartApi, CartOrderPayload, ShopifyCart } from './interfaces'
import { err } from './debug'
import { CART_REFRESH_SELECTORS } from './selectors'

const CART_ENDPOINTS = {
  get: '/cart.js',
  add: '/cart/add.js',
  update: '/cart/update.js',
} as const

export function parseCart(cart: ShopifyCart): CartOrderPayload {
  const lineItems = cart.items.map((item) => ({
    productId: item.product_id.toString(),
    quantity: item.quantity,
  }))

  return {
    lineItems,
    currency: cart.currency,
    totalPrice: cart.total_price,
  }
}

function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  return fetch(url, options).then((response) => {
    if (!response.ok) return Promise.reject(response)
    return response.json() as Promise<T>
  })
}

function getGreensparkApiUrl(shopUniqueName: string): string {
  return shopUniqueName.includes('greenspark-development-store')
    ? 'https://dev-api.getmads.com'
    : 'https://api.getgreenspark.com'
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

  function getCart(): Promise<ShopifyCart> {
    return fetchJSON<ShopifyCart>(CART_ENDPOINTS.get)
  }

  function getOrder(): Promise<CartOrderPayload> {
    return getCart().then(parseCart)
  }

  function addItemToCart(targetProductId: string, quantity = 1): Promise<unknown> {
    return fetchJSON(CART_ENDPOINTS.add, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: [{ id: parseInt(targetProductId, 10), quantity }] }),
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

  function updateCart(updates: Record<string, number>): Promise<Response> {
    return fetch(CART_ENDPOINTS.update, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ updates }),
    })
  }

  function refreshCartDrawer(): void {
    const root = window.Shopify?.routes?.root ?? '/'
    fetch(`${root}?sections=cart-drawer,main-cart-items,main-cart,mini-cart`)
      .then((response) => {
        if (!response.ok) return undefined
        return response.json() as Promise<Record<string, string | undefined>>
      })
      .then((sections) => {
        if (!sections) return

        const parser = new DOMParser()
        const existingDrawer =
          document.querySelector(CART_REFRESH_SELECTORS.cartDrawerForm) ||
          document.querySelector(CART_REFRESH_SELECTORS.cartDrawer)
        if (existingDrawer && sections['cart-drawer']) {
          const newDrawerDoc = parser.parseFromString(sections['cart-drawer'], 'text/html')
          const newDrawerContent =
            newDrawerDoc.querySelector(CART_REFRESH_SELECTORS.cartDrawerForm)?.innerHTML ??
            newDrawerDoc.querySelector(CART_REFRESH_SELECTORS.cartDrawer)?.innerHTML
          if (newDrawerContent !== undefined) existingDrawer.innerHTML = newDrawerContent
        }

        const existingMiniCart =
          document.querySelector(CART_REFRESH_SELECTORS.miniCartForm) ||
          document.querySelector(CART_REFRESH_SELECTORS.miniCart)
        if (existingMiniCart && sections['mini-cart']) {
          const newMiniDoc = parser.parseFromString(sections['mini-cart'], 'text/html')
          const newMiniContent =
            newMiniDoc.querySelector(CART_REFRESH_SELECTORS.miniCartForm)?.innerHTML ??
            newMiniDoc.querySelector(CART_REFRESH_SELECTORS.miniCart)?.innerHTML
          if (newMiniContent !== undefined) existingMiniCart.innerHTML = newMiniContent
        }

        const newCartDocItems = sections['main-cart-items']
          ? parser.parseFromString(sections['main-cart-items'], 'text/html')
          : null
        const newCartDocMain = sections['main-cart']
          ? parser.parseFromString(sections['main-cart'], 'text/html')
          : null
        const newMiniCartDoc = sections['mini-cart']
          ? parser.parseFromString(sections['mini-cart'], 'text/html')
          : null

        const pageTargets = [
          {
            existing: document.querySelector(CART_REFRESH_SELECTORS.mainCartItems),
            findNew: (doc: Document | null) =>
              doc?.querySelector(CART_REFRESH_SELECTORS.mainCartItems),
          },
          {
            existing: document.querySelector(CART_REFRESH_SELECTORS.interactiveCart),
            findNew: (doc: Document | null) =>
              doc?.querySelector(CART_REFRESH_SELECTORS.interactiveCart),
          },
          {
            existing: document.querySelector(CART_REFRESH_SELECTORS.mainCart),
            findNew: (doc: Document | null) => doc?.querySelector(CART_REFRESH_SELECTORS.mainCart),
          },
          {
            existing: document.querySelector(CART_REFRESH_SELECTORS.cartItemsForm),
            findNew: (doc: Document | null) =>
              doc?.querySelector(CART_REFRESH_SELECTORS.cartItemsForm),
          },
          {
            existing: document.querySelector(CART_REFRESH_SELECTORS.miniCartForm),
            findNew: (doc: Document | null) =>
              doc?.querySelector(CART_REFRESH_SELECTORS.miniCartForm),
          },
          {
            existing: document.querySelector(CART_REFRESH_SELECTORS.miniCart),
            findNew: (doc: Document | null) => doc?.querySelector(CART_REFRESH_SELECTORS.miniCart),
          },
        ]

        for (const target of pageTargets) {
          if (!target.existing) continue
          const candidateNew =
            target.findNew(newCartDocItems) ||
            target.findNew(newCartDocMain) ||
            target.findNew(newMiniCartDoc)
          if (candidateNew && candidateNew.innerHTML !== undefined) {
            target.existing.innerHTML = candidateNew.innerHTML
            break
          }
        }
      })
      .catch((error: unknown) => {
        err('cart: Error refreshing cart UI:', error)
        location.reload()
      })
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
