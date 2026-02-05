import { getConfig, getGreensparkApiUrl, getScriptSrc, parseCart } from './config'
import { createCartApi } from './cart'
import { getWidgetContainer, movePopupToBody } from './dom'
import { EnumToWidgetTypeMap } from './interfaces'
import type { WidgetVariant } from './renderers/context'
import { renderWidget } from './renderers'

const MAX_RETRIES = 5
let retryCount = 0

function injectWidgetStyles(): void {
  if (document.getElementById('greenspark-widget-style')) return
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

export function runGreenspark(): void {
  const scriptSrc = getScriptSrc()
  if (!scriptSrc && typeof document === 'undefined') return
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runGreenspark, { once: true })
    return
  }

  const config = getConfig()
  if (!config?.integrationSlug) {
    console.warn('Greenspark Widget (BigCommerce) - Missing GreensparkBigCommerceConfig.integrationSlug')
    return
  }
  const cfg = config

  if (!window.GreensparkWidgets) {
    if (retryCount++ >= MAX_RETRIES) {
      console.error('Greenspark Widget (BigCommerce) - Failed to load after max retries')
      return
    }
    setTimeout(runGreenspark, 50)
    return
  }
  retryCount = 0

  const useShadowDom = false
  const version = 'v2' as const
  const currency = cfg.currency ?? 'USD'
  const productId = cfg.productId ?? ''
  const locale = (cfg.locale ?? 'en') as 'en'
  const integrationSlug = cfg.integrationSlug
  const baseUrl = cfg.storefrontApiBase ?? (typeof window !== 'undefined' ? window.location.origin : '')
  const greensparkApiUrl = getGreensparkApiUrl(integrationSlug)

  const greenspark = new window.GreensparkWidgets({ locale, integrationSlug })
  const cartApi = createCartApi(cfg, baseUrl, currency, greensparkApiUrl)

  const refreshCartUI = () => runGreenspark()

  const ctx = {
    greenspark,
    cartApi,
    parseCart,
    getWidgetContainer,
    movePopupToBody,
    productId,
    currency,
    useShadowDom,
    version,
    refreshCartUI,
  }

  injectWidgetStyles()

  const targets = document.querySelectorAll('.greenspark-widget-target')
  targets.forEach((target) => {
    target.querySelectorAll('.greenspark-widget-instance').forEach((el) => el.remove())
    let type: string
    try {
      ;[type] = atob((target as HTMLElement).id).split('|')
    } catch {
      console.error('Greenspark Widget (BigCommerce) - Invalid widget ID encoding:', (target as HTMLElement).id)
      return
    }
    const variant = EnumToWidgetTypeMap[type] as WidgetVariant | undefined
    if (!variant) return
    const widgetId = (target as HTMLElement).id
    const containerSelector = getWidgetContainer(widgetId)
    renderWidget(ctx, variant, widgetId, containerSelector)
  })
}
