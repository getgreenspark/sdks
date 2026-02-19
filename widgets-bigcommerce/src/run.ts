import {
  getActiveCurrencyCode,
  getConfig,
  getLocale,
  getProductIdFromPage,
  getScriptSrc,
} from './config'
import { createCartApi } from './cart'
import { getWidgetContainer, movePopupToBody } from './dom'
import { err } from './debug'
import { EnumToWidgetTypeMap, type WidgetVariant } from './interfaces'
import { renderWidget } from './widgets'

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
    err('run: missing integrationSlug – add data-integration-slug on a .greenspark-widget-target div')
    return
  }
  const cfg = config

  if (!window.GreensparkWidgets) {
    if (retryCount++ >= MAX_RETRIES) {
      err('run: GreensparkWidgets not available after', MAX_RETRIES, 'retries – check core script load')
      return
    }
    setTimeout(runGreenspark, 50)
    return
  }
  retryCount = 0

  const useShadowDom = false
  const version = 'v2' as const
  const productId = getProductIdFromPage()
  const locale = getLocale()
  const integrationSlug = cfg.integrationSlug
  const baseUrl = window.location.origin

  const greenspark = new window.GreensparkWidgets({
    locale,
    integrationSlug,
    isShopifyIntegration: true,
  })
  const cartApi = createCartApi(baseUrl)

  function runWithContext(currency: string) {
    const ctx = {
      greenspark,
      cartApi,
      getWidgetContainer,
      movePopupToBody,
      productId,
      currency,
      useShadowDom,
      version,
    }
    injectWidgetStyles()
    const targets = document.querySelectorAll('.greenspark-widget-target')
    if (targets.length === 0) {
      err('run: no .greenspark-widget-target in DOM – ensure template outputs a div with class greenspark-widget-target and id = base64(widgetType|widgetId)')
    }
    targets.forEach((target) => {
      const el = target as HTMLElement
      const rawId = el.id
      el.querySelectorAll('.greenspark-widget-instance').forEach((e) => e.remove())
      let type: string
      try {
        ;[type] = atob(rawId).split('|')
      } catch (e) {
        err('run: invalid widget id (not base64 type|widgetId):', rawId, e)
        return
      }
      const variant = EnumToWidgetTypeMap[type] as WidgetVariant | undefined
      if (!variant) {
        err('run: unknown widget type', type, '– known types: 0–9 (see EnumToWidgetTypeMap)')
        return
      }
      const widgetId = rawId
      const containerSelector = getWidgetContainer(widgetId)
      renderWidget(ctx, variant, widgetId, containerSelector)
    })
  }

  cartApi.getCart().then((order) => runWithContext(order.currency || getActiveCurrencyCode())).catch((e) => {
    err('run: getCart failed, using getActiveCurrencyCode() for currency', e)
    runWithContext(getActiveCurrencyCode())
  })
}
