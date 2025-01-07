import type { ShopifyCart } from './interfaces'
import type { WidgetStyle } from '@/interfaces'
import type { AVAILABLE_LOCALES, WIDGET_COLORS } from '@/constants'

type Language = (typeof AVAILABLE_LOCALES)[number]
type WidgetColor = (typeof WIDGET_COLORS)[number]

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
  const scriptSrc = document.currentScript?.getAttribute('src')

  if (!scriptSrc) {
    return
  }

  const scriptUrl = new URL(scriptSrc)
  const urlParams = Object.fromEntries(scriptUrl.searchParams)
  const apiKey = urlParams.api_key
  const color: WidgetColor = (urlParams?.color ?? 'green') as WidgetColor
  const widgetStyle: WidgetStyle = (urlParams?.widgetStyle ?? 'default') as WidgetStyle
  const withPopup = urlParams?.withPopup === '1'
  const popupTheme = 'light'
  const isoCode = window.Shopify.locale
  const locale: Language = (['en', 'de'].includes(isoCode) ? isoCode : 'en') as Language
  const initialCart = {
    items: [],
    currency: 'GBP',
    total_price: 0,
  }
  const shopUniqueName = window.Shopify.shop
  const cartEl = document.querySelector('.cart__footer, .drawer__footer')
  const gsWidgetTargetEl = document.querySelector('[data-greenspark-widget-target]')

  if (cartEl && !gsWidgetTargetEl) {
    cartEl.insertAdjacentHTML('afterbegin', '<div data-greenspark-widget-target></div>')
  }

  const greenspark = new window.GreensparkWidgets({
    apiKey,
    locale,
    integrationSlug: shopUniqueName,
    isShopifyIntegration: true,
  })

  const widget = greenspark.cart({
    color,
    containerSelector: '[data-greenspark-widget-target]',
    useShadowDom: false,
    style: widgetStyle,
    withPopup,
    popupTheme,
    order: parseCart(initialCart),
    version: 'v2',
  })

  const movePopupToBody = () => {
    if (!withPopup) return

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
  await loadScript('https://cdn.getgreenspark.com/scripts/widgets%40latest.js')
  window.dispatchEvent(new Event('greenspark-setup'))
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
