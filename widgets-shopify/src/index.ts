import type { ShopifyCart } from './interfaces'
import { EnumToWidgetTypeMap } from './interfaces'

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

  if (!window.GreensparkWidgets) {
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
  const initialCart = {
    items: [],
    currency: 'GBP',
    total_price: 0,
  }
  const shopUniqueName = window.Shopify.shop
  const greenspark = new window.GreensparkWidgets({
    locale,
    integrationSlug: shopUniqueName,
    isShopifyIntegration: true,
  })

  const renderOrderImpacts = (widgetId: string, containerSelector: string) => {
    const checkboxSelector = `${containerSelector} input[name='customerCartContribution']`
    const getCheckbox = () => document.querySelector<HTMLInputElement>(checkboxSelector)
    const prevChecked = getCheckbox() ? getCheckbox()!.checked : undefined

    const setupPopupMove = () => {
      popupHistory.forEach((outdatedPopup) => {
        outdatedPopup.innerHTML = ''
        outdatedPopup.style.display = 'none'
      })

      const popup = document.querySelector<HTMLElement>(
        `${containerSelector} > div[class^='gs-popup-']`,
      )
      if (popup) {
        document.body.append(popup)
        popupHistory.push(popup)
      }
    }

    const ensureHandlers = () => {
      const updateCheckboxState = (checkbox: HTMLInputElement, productId: string) => {
        fetch('/cart.js')
          .then((r) => r.json())
          .then((cart: { items: { id?: string | number }[] }) => {
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
            `${containerSelector} input[name='customerCartContribution']`,
          )
          if (!checkbox) return
          const productId = checkbox.getAttribute('data-greenspark-product-external-id')
          const PREVIEW_EXTERNAL_ID = 'PREVIEW_EXTERNAL_ID'

          const isPreviewProduct = productId === PREVIEW_EXTERNAL_ID
          if (!productId || isPreviewProduct) return

          if (checkbox.checked) {
            fetch('/cart.js')
              .then((r) => r.json())
              .then((cart: { items: { id?: string | number }[] }) => {
                if (cart.items.find((item) => String(item.id) === productId)) return
                return fetch('/cart/add.js', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                  },
                  body: JSON.stringify({ items: [{ id: parseInt(productId), quantity: 1 }] }),
                })
                  .then((r) => r.json())
                  .then(refreshCartDrawer)
              })
              .catch((err) => console.error('Greenspark Widget - add error', err))
          } else {
            fetch('/cart.js')
              .then((r) => r.json())
              .then((cart: { items: { id?: string | number }[] }) => {
                if (!cart.items.find((item) => String(item.id) === productId)) return
                const updates: Record<string, number> = {}
                updates[productId] = 0
                return fetch('/cart/update.js', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                  },
                  body: JSON.stringify({ updates }),
                })
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
          setTimeout(() => {
            updateCheckboxState(checkbox, productId)
            location.reload()
          }, 400)
        })
      }

      const initCheckboxState = () => {
        const checkbox = getCheckbox()
        if (!checkbox) return
        const productId = checkbox.getAttribute('data-greenspark-product-external-id')
        if (!productId) return
        fetch('/cart.js')
          .then((r) => r.json())
          .then((cart: { items: { id?: string | number }[] }) => {
            const present = cart.items.some((item) => String(item.id) === productId)
            checkbox.checked = present
          })
          .catch(() => {})
      }

      bindCheckbox()
      bindRemove()
      initCheckboxState()
    }

    const refreshCartDrawer = () => {
      const root = window.Shopify?.routes?.root ?? '/'
      fetch(`${root}?sections=cart-drawer,main-cart-items`)
        .then((response) => {
          if (!response.ok) return
          return response.json()
        })
        .then((sections) => {
          if (!sections) return
          const parser = new DOMParser()
          const existingDrawer = document.querySelector('#CartDrawer-Form')
          if (existingDrawer && sections['cart-drawer']) {
            const newDrawerDoc = parser.parseFromString(sections['cart-drawer'], 'text/html')
            const newDrawerContent = newDrawerDoc.querySelector('#CartDrawer-Form')?.innerHTML
            if (newDrawerContent !== undefined) existingDrawer.innerHTML = newDrawerContent
          }
          const cartPageSection = document.querySelector('#main-cart-items')
          if (cartPageSection && sections['main-cart-items']) {
            const newCartDoc = parser.parseFromString(sections['main-cart-items'], 'text/html')
            const newCartContent = newCartDoc.querySelector('#main-cart-items')?.innerHTML
            if (newCartContent !== undefined) cartPageSection.innerHTML = newCartContent
          }
        })
        .catch((error) => {
          console.error('Greenspark Widget - Error refreshing cart UI:', error)
          location.reload()
        })
    }

    if (window.greensparkCartWidget) {
      return fetch('/cart.js')
        .then((r) => r.json())
        .then((updatedCart) => {
          const order = parseCart(updatedCart)
          if (order.lineItems.length <= 0) return
          return window
            .greensparkCartWidget!.render({ order }, containerSelector)
            .then(() => {
              setupPopupMove()
              if (typeof prevChecked === 'boolean') {
                const cb = getCheckbox()
                if (cb) cb.checked = prevChecked
              }
            })
            .catch((e: unknown) => console.error('Greenspark Widget - ', e))
        })
    }

    const widget = greenspark.cartById({
      widgetId,
      containerSelector,
      useShadowDom,
      order: parseCart(initialCart),
      version,
    })

    window.greensparkCartWidget = widget
    widget
      .render()
      .then(setupPopupMove)
      .then(() => fetch('/cart.js'))
      .then((r) => r?.json())
      .then((updatedCart) => {
        if (!updatedCart) return
        const order = parseCart(updatedCart)
        if (order.lineItems.length <= 0) return
        return widget.render({ order }).then(setupPopupMove)
      })
      .then(ensureHandlers)
      .catch((e: unknown) => console.error('Greenspark Widget - ', e))
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
      .then(movePopupToBody)
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
      .then(movePopupToBody)
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
      .then(movePopupToBody)
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
      .then(movePopupToBody)
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
      .then(movePopupToBody)
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
      .then(movePopupToBody)
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
      .then(movePopupToBody)
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
      .then(movePopupToBody)
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
      .then(movePopupToBody)
      .catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e)
      })
  }

  const movePopupToBody = () => {
    popupHistory.forEach((outdatedPopup) => {
      outdatedPopup.innerHTML = ''
      outdatedPopup.style.display = 'none'
    })

    const popup = document.querySelector<HTMLElement>('.gs-popup')
    if (popup) {
      document.body.append(popup)
      popupHistory.push(popup)
    }
  }

  const targets = document.querySelectorAll('.greenspark-widget-target')

  // Add styles for widget targets
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
    const randomId = crypto.randomUUID()
    let type: string
    try {
      ;[type] = atob(target.id).split('|')
    } catch {
      console.error('Invalid widget ID encoding:', target.id)
      return
    }

    const variant = EnumToWidgetTypeMap[type]
    let containerSelector = ''

    if (variant === 'orderImpacts') {
      const existingInstance = target.querySelector(
        '.greenspark-widget-instance',
      ) as HTMLElement | null
      if (existingInstance) {
        const existingAttr = Array.from(existingInstance.attributes).find((a) =>
          a.name.startsWith('data-greenspark-widget-target-'),
        )
        if (existingAttr) {
          containerSelector = `[${existingAttr.name}]`
        }
      }

      if (!containerSelector) {
        target.querySelectorAll('.greenspark-widget-instance').forEach((el) => el.remove())
        containerSelector = `[data-greenspark-widget-target-${randomId}]`
        target.insertAdjacentHTML(
          'afterbegin',
          `<div class="greenspark-widget-instance" data-greenspark-widget-target-${randomId}></div>`,
        )
      }
    } else {
      target.querySelectorAll('.greenspark-widget-instance').forEach((el) => el.remove())
      containerSelector = `[data-greenspark-widget-target-${randomId}]`
      target.insertAdjacentHTML(
        'afterbegin',
        `<div class="greenspark-widget-instance" data-greenspark-widget-target-${randomId}></div>`,
      )
    }

    if (variant === 'orderImpacts') renderOrderImpacts(target.id, containerSelector)
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
  if (window.GreensparkWidgets) return

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

if (!window.GreensparkWidgets) {
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
        if (
          [
            `${window.location.origin}/cart/add`,
            `${window.location.origin}/cart/update`,
            `${window.location.origin}/cart/change`,
            `${window.location.origin}/cart/clear`,
            `${window.location.origin}/cart/add.js`,
            `${window.location.origin}/cart/update.js`,
            `${window.location.origin}/cart/change.js`,
            `${window.location.origin}/cart/clear.js`,
          ].includes(res.url)
        ) {
          setTimeout(() => {
            runGreenspark()
          }, 100)
        }
      })
      .catch((error) => {
        console.error('Error in fetch response handling:', error)
      }) // log errors for debugging

    return response
  }
})(window, window.fetch)
