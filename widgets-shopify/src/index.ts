import type { ShopifyCart } from './interfaces'
import { EnumToWidgetTypeMap } from './interfaces'

const scriptSrc = document.currentScript?.getAttribute('src')
const isDevStore = window.location.hostname.includes('greenspark-development-store')
const widgetUrl = isDevStore
  ? 'https://cdn.getgreenspark.com/scripts/widgets%401.9.1-5-umd.js'
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
    const widget = greenspark.cartById({
      widgetId,
      order: parseCart(initialCart),
      containerSelector,
      useShadowDom,
      version,
    })

    fetch('/cart.js')
      .then((response) => response.json())
      .then((updatedCart) => {
        const order = parseCart(updatedCart)
        if (order.lineItems.length <= 0) return

        widget
          .render({ order })
          .then(() => movePopupToBody(widgetId))
          .catch((e: Error) => console.error('Greenspark Widget - ', e))
      })
      .catch((error) => {
        console.error('Greenspark Widget - Failed to fetch cart.js:', error)
      })
  }

  const renderOffsetPerOrder = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.perOrderById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget.render().then(() => movePopupToBody(widgetId)).catch((e) => {
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

    widget.render().then(() => movePopupToBody(widgetId)).catch((e) => {
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

    widget.render().then(() => movePopupToBody(widgetId)).catch((e) => {
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

    widget.render().then(() => movePopupToBody(widgetId)).catch((e) => {
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

    widget.render().then(() => movePopupToBody(widgetId)).catch((e) => {
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

    widget.render().then(() => movePopupToBody(widgetId)).catch((e) => {
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

    widget.render().then(() => movePopupToBody(widgetId)).catch((e) => {
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

    widget.render().then(() => movePopupToBody(widgetId)).catch((e) => {
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

    widget.render().then(() => movePopupToBody(widgetId)).catch((e) => {
      if (!e.response) return console.error('Greenspark Widget - ', e)
    })
  }

  const movePopupToBody = (widgetId: string) => {
    popupHistory.forEach((outdatedPopup) => {
      outdatedPopup.innerHTML = ''
      outdatedPopup.style.display = 'none'
    })

    const parent = document.getElementById(widgetId);
    const popup = parent?.querySelector<HTMLElement>('div[class^="gs-popup-"]');
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

  targets.forEach(target => {
    // Remove any previously injected containers
    target.querySelectorAll('.greenspark-widget-instance').forEach(el => el.remove())

    const randomId = crypto.randomUUID()
    let type: string
    try {
      [type] = atob(target.id).split('|')
    } catch {
      console.error('Invalid widget ID encoding:', target.id)
      return
    }

    const variant = EnumToWidgetTypeMap[type]
    const containerSelector = `[data-greenspark-widget-target-${randomId}]`
    target.insertAdjacentHTML('afterbegin', `<div class="greenspark-widget-instance" data-greenspark-widget-target-${randomId}></div>`)

    if (variant === 'orderImpacts') renderOrderImpacts(target.id, containerSelector)
    if (variant === 'offsetPerOrder') renderOffsetPerOrder(target.id, containerSelector)
    if (variant === 'offsetByProduct') renderOffsetByProduct(target.id, containerSelector)
    if (variant === 'offsetBySpend') renderOffsetBySpend(target.id, containerSelector)
    if (variant === 'offsetByStoreRevenue') renderOffsetByStoreRevenue(target.id, containerSelector)
    if (variant === 'byPercentage') renderByPercentage(target.id, containerSelector)
    if (variant === 'byPercentageOfRevenue') renderByPercentageOfRevenue(target.id, containerSelector)
    if (variant === 'stats') renderStats(target.id, containerSelector)
    if (variant === 'static') renderStatic(target.id, containerSelector)
    if (variant === 'banner') renderBanner(target.id, containerSelector)
  })
}

function loadScript(url: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = function() {
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
      document.addEventListener('DOMContentLoaded', () => {
        setup().then(resolve)
      }, { once: true })
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

;(function(context, fetch) {
  if (typeof fetch !== 'function') return

  context.fetch = function(...args: [input: URL | RequestInfo, init?: RequestInit | undefined]) {
    const response = fetch.apply(this, args)

    response.then((res) => {
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
    }).catch((error) => {
      console.error('Error in fetch response handling:', error)
    }) // log errors for debugging

    return response
  }
})(window, window.fetch)
