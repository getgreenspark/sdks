import type { ShopifyCart } from './interfaces'
import { EnumToWidgetTypeMap } from './interfaces'
import { type GreensparkCartWidgetKey } from './global.d'

const scriptSrc = document.currentScript?.getAttribute('src')
const isDevStore = window.location.hostname.includes('greenspark-development-store')
const widgetUrl = isDevStore
  ? 'https://cdn.getgreenspark.com/scripts/widgets%402.2.0-2-umd.js'
  : 'https://cdn.getgreenspark.com/scripts/widgets%40latest.js'
const popupHistory: HTMLElement[] = []

const MAX_RETRIES = 5
let retryCount = 0

function parseCart(cart: ShopifyCart) {
  const lineItems = cart.items.map((item) => ({
    productId: item.product_id.toString(),
    quantity: item.quantity,
  }))
  const { currency } = cart
  const totalPrice = cart.total_price
  return {
    lineItems,
    currency,
    totalPrice,
  }
}

function runGreenspark() {
  if (!scriptSrc) return

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runGreenspark, { once: true })
  }

  if (!window.GreensparkWidgets || typeof window.GreensparkWidgets !== 'function') {
    if (retryCount++ >= MAX_RETRIES) {
      console.error('Greenspark Widget - Failed to load after max retries')
      return
    }
    console.warn('Greenspark Widget - GreensparkWidgets not available yet, waiting 50ms')
    setTimeout(runGreenspark, 50)
    return
  }

  retryCount = 0 // reset on success

  const useShadowDom = false
  const version = 'v2'

  const currency = window.Shopify.currency.active
  const productId = String(window?.ShopifyAnalytics?.meta?.product?.id ?? '')
  const locale = window.Shopify.locale as 'en'
  const shopUniqueName = window.Shopify.shop
  const greenspark = new window.GreensparkWidgets({
    locale,
    integrationSlug: shopUniqueName,
    isShopifyIntegration: true,
  })

  const CART_ENDPOINTS = {
    get: '/cart.js',
    add: '/cart/add.js',
    update: '/cart/update.js',
  }

  function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    return fetch(url, options).then((response) => {
      if (!response.ok) return Promise.reject(response)
      return response.json() as Promise<T>
    })
  }

  function getCart(): Promise<ShopifyCart> {
    return fetchJSON<ShopifyCart>(CART_ENDPOINTS.get)
  }

  function addItemToCart(targetProductId: string, quantity = 1): Promise<unknown> {
    return fetchJSON(CART_ENDPOINTS.add, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: [{ id: parseInt(targetProductId, 10), quantity }] }),
    })
  }

  function updateCart(updates: Record<string, number>): Promise<Response> {
    return fetch(CART_ENDPOINTS.update, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ updates }),
    })
  }

  const getSafeId = (widgetId: string) => widgetId.replace(/[^a-z0-9_-]/gi, '-').toLowerCase()
  const ensureContainer = (widgetId: string): string => {
    const safe = getSafeId(widgetId)
    const selector = `[data-greenspark-widget-container-for="${safe}"]`
    const target = document.getElementById(widgetId)
    if (!target) return selector
    const el = target.querySelector(selector) as HTMLElement | null
    if (!el) {
      target.querySelectorAll('.greenspark-widget-instance').forEach((e) => e.remove())
      target.insertAdjacentHTML(
        'afterbegin',
        `<div class="greenspark-widget-instance" data-greenspark-widget-container-for="${safe}"></div>`,
      )
    }
    return selector
  }

  const renderOrderImpacts = (widgetId: string) => {
    const targetEl = document.getElementById(widgetId)
    if (!targetEl) {
      return
    }

    let targetContainerSelector = ensureContainer(widgetId)

    if (!document.querySelector(targetContainerSelector)) {
      return
    }

    const checkboxSelector = "input[name='customerCartContribution']"
    const getCheckbox = () => document.querySelector<HTMLInputElement>(checkboxSelector)
    const prevChecked = getCheckbox() ? getCheckbox()!.checked : undefined
    const cartWidgetWindowKey = `greensparkCartWidget-${widgetId}` as GreensparkCartWidgetKey

    const SELECTORS = {
      cartDrawerForm: '#CartDrawer-Form',
      cartDrawer: '#CartDrawer',
      mainCartItems: '#main-cart-items',
      mainCart: '#main-cart',
      interactiveCart: 'interactive-cart',
      cartItemsForm: 'cart-items[form-id]',
    }

    const ensureHandlers = () => {
      const WIDGET_PRESELECT_OPT_OUT_KEY = 'greenspark-preselect-optout'

      const isWidgetPreselectOptedOut = (): boolean => {
        try {
          return localStorage.getItem(WIDGET_PRESELECT_OPT_OUT_KEY) === '1'
        } catch {
          return false
        }
      }
      const setWidgetPreselectOptOut = () => localStorage.setItem(WIDGET_PRESELECT_OPT_OUT_KEY, '1')
      const clearWidgetPreselectOptOut = () => localStorage.removeItem(WIDGET_PRESELECT_OPT_OUT_KEY)

      const updateCheckboxState = (checkbox: HTMLInputElement, productId: string) => {
        getCart()
          .then((cart) => {
            const matchingItem = cart.items.find((item) => String(item.id) === productId)
            checkbox.checked = Boolean(matchingItem)
          })
          .catch((err) => console.error('Greenspark Widget - Error checking cart state:', err))
      }

      const bindCheckbox = () => {
        if (window._greensparkCheckboxHandlerBound) return
        window._greensparkCheckboxHandlerBound = true
        document.addEventListener('change', (e) => {
          const checkbox = (e.target as HTMLElement)?.closest<HTMLInputElement>(
            "input[name='customerCartContribution']",
          )
          if (!checkbox) return
          const productId = checkbox.getAttribute('data-greenspark-product-external-id')
          const PREVIEW_EXTERNAL_ID = 'PREVIEW_EXTERNAL_ID'

          const isPreviewProduct = productId === PREVIEW_EXTERNAL_ID
          if (!productId || isPreviewProduct) return

          if (checkbox.checked) {
            clearWidgetPreselectOptOut()

            getCart()
              .then((cart) => {
                if (cart.items.find((item) => String(item.id) === productId)) return
                return addItemToCart(productId, 1).then(() => refreshCartDrawer())
              })
              .catch((err) => console.error('Greenspark Widget - add error', err))
          } else {
            setWidgetPreselectOptOut()

            getCart()
              .then((cart) => {
                if (!cart.items.find((item) => String(item.id) === productId)) return
                const updates: Record<string, number> = {}
                updates[productId] = 0
                return updateCart(updates)
              })
              .then((response) => {
                if (response && (response as Response).ok) refreshCartDrawer()
              })
              .catch((err) => console.error('Greenspark Widget - remove error', err))
          }
        })
      }

      const bindRemove = () => {
        if (window._greensparkRemoveHandlerBound) return
        window._greensparkRemoveHandlerBound = true
        document.addEventListener('click', (e) => {
          const removeEl = (e.target as HTMLElement)?.closest(
            'cart-remove-button, .cart-remove-button, [data-cart-remove]',
          )
          if (!removeEl) return
          const checkbox = getCheckbox()
          if (!checkbox) return
          const productId = checkbox.getAttribute('data-greenspark-product-external-id')
          if (!productId) return
          setWidgetPreselectOptOut()
          setTimeout(() => {
            updateCheckboxState(checkbox, productId)
          }, 400)
        })
      }

      const initCheckboxState = () => {
        const checkbox = getCheckbox()
        if (!checkbox) return
        const productId = checkbox.getAttribute('data-greenspark-product-external-id')
        if (!productId) return
        const PREVIEW_EXTERNAL_ID = 'PREVIEW_EXTERNAL_ID'
        const isPreviewProduct = productId === PREVIEW_EXTERNAL_ID

        const preSelectedAttr = checkbox.getAttribute('data-greenspark-widget-pre-selected')
        const isCheckboxPreSelected = preSelectedAttr === 'true'

        getCart()
          .then((cart) => {
            const present = cart.items.some((item) => String(item.id) === productId)
            if (
              isCheckboxPreSelected &&
              !present &&
              !isPreviewProduct &&
              !isWidgetPreselectOptedOut() &&
              !Number.isNaN(parseInt(productId, 10))
            ) {
              return addItemToCart(productId, 1)
                .then(() => {
                  checkbox.checked = true
                  refreshCartDrawer()
                })
                .catch((err) => {
                  console.error('Greenspark Widget - pre-selected add error', err)
                  checkbox.checked = present
                })
            }
            checkbox.checked = present
          })
          .catch((err) => {
            console.error('Greenspark Widget - getCart error', err)
          })
      }

      bindCheckbox()
      bindRemove()
      initCheckboxState()
    }

    const refreshCartDrawer = () => {
      const root = window.Shopify?.routes?.root ?? '/'
      fetch(`${root}?sections=cart-drawer,main-cart-items,main-cart`)
        .then((response) => {
          if (!response.ok) return
          return response.json()
        })
        .then((sections) => {
          const parser = new DOMParser()

          const existingDrawer =
            document.querySelector(SELECTORS.cartDrawerForm) ||
            document.querySelector(SELECTORS.cartDrawer)
          if (existingDrawer && sections['cart-drawer']) {
            const newDrawerDoc = parser.parseFromString(sections['cart-drawer'], 'text/html')
            const newDrawerContent =
              newDrawerDoc.querySelector(SELECTORS.cartDrawerForm)?.innerHTML ??
              newDrawerDoc.querySelector(SELECTORS.cartDrawer)?.innerHTML
            if (newDrawerContent !== undefined) existingDrawer.innerHTML = newDrawerContent
          }

          const newCartDocItems = sections['main-cart-items']
            ? parser.parseFromString(sections['main-cart-items'], 'text/html')
            : null
          const newCartDocMain = sections['main-cart']
            ? parser.parseFromString(sections['main-cart'], 'text/html')
            : null

          const pageTargets = [
            {
              existing: document.querySelector(SELECTORS.mainCartItems),
              findNew: (doc: Document | null) => doc?.querySelector(SELECTORS.mainCartItems),
            },
            {
              existing: document.querySelector(SELECTORS.interactiveCart),
              findNew: (doc: Document | null) => doc?.querySelector(SELECTORS.interactiveCart),
            },
            {
              existing: document.querySelector(SELECTORS.mainCart),
              findNew: (doc: Document | null) => doc?.querySelector(SELECTORS.mainCart),
            },
            {
              existing: document.querySelector(SELECTORS.cartItemsForm),
              findNew: (doc: Document | null) => doc?.querySelector(SELECTORS.cartItemsForm),
            },
          ]

          for (const target of pageTargets) {
            if (!target.existing) continue
            const candidateNew = target.findNew(newCartDocItems) || target.findNew(newCartDocMain)
            if (candidateNew && candidateNew.innerHTML !== undefined) {
              ;(target.existing as Element).innerHTML = candidateNew.innerHTML
              break
            }
          }
        })
        .catch((error) => {
          console.error('Greenspark Widget - Error refreshing cart UI:', error)
          location.reload()
        })
    }

    if (window[cartWidgetWindowKey]) {
      return fetch('/cart.js')
        .then((r) => r.json())
        .then((updatedCart) => {
          const order = parseCart(updatedCart)
          if (order.lineItems.length <= 0) return
          targetContainerSelector = ensureContainer(widgetId)
          if (!document.querySelector(targetContainerSelector)) return
          return window[cartWidgetWindowKey]!.render({ order }, targetContainerSelector)
            .then(() => {
              movePopupToBody(widgetId)

              if (typeof prevChecked === 'boolean') {
                const cb = getCheckbox()
                if (cb) cb.checked = prevChecked
              }
            })
            .then(ensureHandlers)
            .catch((e: unknown) => console.error('Greenspark Widget - ', e))
        })
    }

    fetch('/cart.js')
      .then((r) => {
        return r?.json()
      })
      .then((cartData) => {
        if (!cartData) return
        const order = parseCart(cartData)
        if (order.lineItems.length === 0) return

        targetContainerSelector = ensureContainer(widgetId)
        if (!document.querySelector(targetContainerSelector)) return

        const widget = greenspark.cartById({
          widgetId,
          containerSelector: targetContainerSelector,
          useShadowDom,
          order,
          version,
        })
        window[cartWidgetWindowKey] = widget

        return widget
          .render({ order }, targetContainerSelector)
          .then(() => movePopupToBody(widgetId))
          .then(ensureHandlers)
          .catch((e: Error) => console.error('Greenspark Widget - ', e))
      })
      .catch((e: unknown) => console.error('Greenspark Widget - Error fetching cart:', e))
  }

  const renderOffsetPerOrder = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.perOrderById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e)
      })
  }

  const renderOffsetByProduct = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.perProductById({
      widgetId,
      productId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e)
      })
  }

  const renderOffsetBySpend = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.spendLevelById({
      widgetId,
      currency,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e)
      })
  }

  const renderOffsetByStoreRevenue = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.tieredSpendLevelById({
      widgetId,
      currency,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e)
      })
  }

  const renderByPercentage = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.byPercentageById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e)
      })
  }

  const renderByPercentageOfRevenue = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.byPercentageOfRevenueById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e)
      })
  }

  const renderStats = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.topStatsById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e)
      })
  }

  const renderStatic = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.staticById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e)
      })
  }

  const renderBanner = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.fullWidthBannerById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e)
      })
  }

  const movePopupToBody = (widgetId: string) => {
    popupHistory.forEach((outdatedPopup) => {
      outdatedPopup.innerHTML = ''
      outdatedPopup.style.display = 'none'
    })

    const parent = document.getElementById(widgetId)
    const popup = parent?.querySelector<HTMLElement>('div[class^="gs-popup-"]')
    if (popup) {
      document.body.append(popup)
      popupHistory.push(popup)
    }
  }

  const targets = document.querySelectorAll('.greenspark-widget-target')

  if (!document.getElementById('greenspark-widget-style')) {
    const style = document.createElement('style')
    style.id = 'greenspark-widget-style'
    style.textContent = `
      .greenspark-widget-target {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 8px 0;
      }
    `
    document.head.appendChild(style)
  }

  targets.forEach((target) => {
    target.querySelectorAll('.greenspark-widget-instance').forEach((el) => el.remove())

    let type: string
    try {
      ;[type] = atob(target.id).split('|')
    } catch {
      console.error('Invalid widget ID encoding:', target.id)
      return
    }

    const variant = EnumToWidgetTypeMap[type]

    const containerSelector = ensureContainer(target.id)

    if (variant === 'orderImpacts') renderOrderImpacts(target.id)
    if (variant === 'offsetPerOrder') renderOffsetPerOrder(target.id, containerSelector)
    if (variant === 'offsetByProduct') renderOffsetByProduct(target.id, containerSelector)
    if (variant === 'offsetBySpend') renderOffsetBySpend(target.id, containerSelector)
    if (variant === 'offsetByStoreRevenue') renderOffsetByStoreRevenue(target.id, containerSelector)
    if (variant === 'byPercentage') renderByPercentage(target.id, containerSelector)
    if (variant === 'byPercentageOfRevenue')
      renderByPercentageOfRevenue(target.id, containerSelector)
    if (variant === 'stats') renderStats(target.id, containerSelector)
    if (variant === 'static') renderStatic(target.id, containerSelector)
    if (variant === 'banner') renderBanner(target.id, containerSelector)
  })
}

function loadScript(url: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = function () {
      resolve()
    }

    script.src = url
    const head = document.querySelector('head')

    if (head) {
      head.appendChild(script)
    }
  })
}

async function setup() {
  if (window.GreensparkWidgets && typeof window.GreensparkWidgets === 'function') return

  if (document.readyState === 'loading') {
    return new Promise((resolve) => {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          setup().then(resolve)
        },
        { once: true },
      )
    })
  }

  try {
    await loadScript(widgetUrl)
    window.dispatchEvent(new Event('greenspark-setup'))
  } catch (error) {
    console.error('Greenspark Widget - Failed to load script:', error)
    setTimeout(() => setup(), 1000)
  }
}

setup().catch((e) => console.error('Greenspark Widget -', e))

if (!window.GreensparkWidgets || typeof window.GreensparkWidgets !== 'function') {
  window.addEventListener('greenspark-setup', runGreenspark, { once: true })
} else {
  runGreenspark()
}

;(function (context, fetch) {
  if (typeof fetch !== 'function') return

  context.fetch = function (...args: [input: URL | RequestInfo, init?: RequestInit | undefined]) {
    const response = fetch.apply(this, args)

    response
      .then((res) => {
        const url = new URL(res.url, window.location.origin)
        const pathname = url.pathname
        const isCartMutation = /\/cart\/(add|update|change|clear)(\.js)?$/.test(pathname)

        if (isCartMutation) {
          setTimeout(() => {
            runGreenspark()
          }, 300)
        }
      })
      .catch((error) => {
        console.error('Error in fetch response handling:', error)
      })

    return response
  }
})(window, window.fetch)
