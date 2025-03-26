import type {ShopifyCart} from './interfaces';
import { WidgetType} from './interfaces'

const scriptSrc = document.currentScript?.getAttribute('src')
const isDevStore = window.location.hostname.includes('greenspark-development-store')
const widgetUrl = isDevStore
  ? 'https://cdn.getgreenspark.com/scripts/widgets%401.9.1-2-umd.js'
  : 'https://cdn.getgreenspark.com/scripts/widgets%401.9.1-2-umd.js'
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

  // const currency = window.Shopify.currency.active
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
    target.insertAdjacentHTML('afterbegin', '<div data-greenspark-widget-target></div>')
    const [type, widgetId]: string[] = atob(target.id).split('|')
    const variant = WidgetType[type]

    if (variant ==='cart') {
      const widget = greenspark.cartById({
        widgetId,
        containerSelector: '[data-greenspark-widget-target]',
        useShadowDom: false,
        order: parseCart(initialCart),
        version: 'v2',
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

    if (variant ==='perOrder') {
      const widget = greenspark.perOrderById({
        widgetId,
        containerSelector: '[data-greenspark-widget-target]',
        useShadowDom: false,
        version: 'v2',
      })

      widget.render().catch((e) => {
        if (!e.response) return console.error('Greenspark Widget - ', e);
      });
    }
  })


  const movePopupToBody = () => {
    // if (!withPopup) return

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
  await loadScript(widgetUrl)
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
