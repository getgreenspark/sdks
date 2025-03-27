import type { ShopifyCart } from './interfaces'
import { EnumToWidgetTypeMap } from './interfaces'

const scriptSrc = document.currentScript?.getAttribute('src')
const isDevStore = window.location.hostname.includes('greenspark-development-store')
const widgetUrl = isDevStore
  ? 'https://cdn.getgreenspark.com/scripts/widgets%401.9.1-4-umd.js'
  : 'https://cdn.getgreenspark.com/scripts/widgets%401.9.1-4-umd.js'
const popupHistory: HTMLElement[] = []

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
  if (!scriptSrc) {
    return
  }

  const useShadowDom = false
  const version = 'v2'

  const currency = window.Shopify.currency.active
  const productId = window.ShopifyAnalytics.meta.product.id.toString()
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

  const targets = document.querySelectorAll('.greenspark-widget-target')
  targets.forEach(target => {
    const randomId = crypto.randomUUID()
    const [type, widgetId]: string[] = atob(target.id).split('|')
    const variant = EnumToWidgetTypeMap[type]
    const containerSelector = `[data-greenspark-widget-target-${randomId}]`
    target.insertAdjacentHTML('afterbegin', `<div data-greenspark-widget-target-${randomId}></div>`)

    if (variant === 'orderImpacts') renderOrderImpacts(widgetId, containerSelector)
    if (variant === 'offsetPerOrder') renderOffsetPerOrder(widgetId, containerSelector)
    if (variant === 'offsetByProduct') renderOffsetByProduct(widgetId, containerSelector)
    if (variant === 'offsetBySpend') renderOffsetBySpend(widgetId, containerSelector)
    if (variant === 'offsetByStoreRevenue') renderOffsetByStoreRevenue(widgetId, containerSelector)
    if (variant === 'byPercentage') renderByPercentage(widgetId, containerSelector)
    if (variant === 'byPercentageOfRevenue') renderByPercentageOfRevenue(widgetId, containerSelector)
    if (variant === 'stats') renderStats(widgetId, containerSelector)
    if (variant === 'static') renderStatic(widgetId, containerSelector)
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
          .then(movePopupToBody)
          .catch((e: Error) => {
            console.error('Greenspark Widget - ', e)
          })
      })
  }

  const renderOffsetPerOrder = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.perOrderById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget.render().then(movePopupToBody).catch((e) => {
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

    widget.render().then(movePopupToBody).catch((e) => {
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

    widget.render().then(movePopupToBody).catch((e) => {
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

    widget.render().then(movePopupToBody).catch((e) => {
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

    widget.render().then(movePopupToBody).catch((e) => {
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

    widget.render().then(movePopupToBody).catch((e) => {
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

    widget.render().then(movePopupToBody).catch((e) => {
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

    widget.render().then(movePopupToBody).catch((e) => {
      if (!e.response) return console.error('Greenspark Widget - ', e)
    })
  }

  const movePopupToBody = () => {
    popupHistory.forEach((outdatedPopup) => {
      outdatedPopup.innerHTML = ''
      outdatedPopup.style.display = 'none'
    })

    const popup = document.querySelector('.gs-popup') as HTMLElement | null
    if (popup) {
      document.body.append(popup)
      popupHistory.push(popup)
    }
  }

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
  await loadScript(widgetUrl)
  window.dispatchEvent(new Event('greenspark-setup'))
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
    })

    return response
  }
})(window, window.fetch)
