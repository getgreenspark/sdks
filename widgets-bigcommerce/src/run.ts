import { getConfig, getScriptSrc } from './config'
import { createCartApi } from './cart'
import { getWidgetContainer, movePopupToBody } from './dom'
import { err, log, warn } from './debug'
import { EnumToWidgetTypeMap } from './interfaces'
import type { WidgetVariant } from './renderers'
import { renderWidget } from './renderers'

const MAX_RETRIES = 5
let retryCount = 0

function injectWidgetStyles(): void {
  if (document.getElementById('greenspark-widget-style')) return
  log('run: injecting widget styles')
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
  log('run: runGreenspark() called')
  const scriptSrc = getScriptSrc()
  if (!scriptSrc && typeof document === 'undefined') {
    log('run: exiting (no scriptSrc and no document)')
    return
  }
  if (document.readyState === 'loading') {
    log('run: document still loading, re-scheduling runGreenspark on DOMContentLoaded')
    document.addEventListener('DOMContentLoaded', runGreenspark, { once: true })
    return
  }

  const config = getConfig()
  if (!config?.integrationSlug) {
    warn('run: missing integrationSlug – add data-integration-slug on a .greenspark-widget-target div')
    return
  }
  const cfg = config

  if (!window.GreensparkWidgets) {
    if (retryCount++ >= MAX_RETRIES) {
      err('run: GreensparkWidgets not available after', MAX_RETRIES, 'retries – check core script load')
      return
    }
    log('run: GreensparkWidgets not on window yet, retry', retryCount, 'in 50ms')
    setTimeout(runGreenspark, 50)
    return
  }
  log('run: GreensparkWidgets available, retryCount reset')
  retryCount = 0

  const useShadowDom = false
  const version = 'v2' as const
  const currency = cfg.currency ?? 'USD'
  const productId = cfg.productId ?? ''
  const locale = (cfg.locale ?? 'en') as 'en'
  const integrationSlug = cfg.integrationSlug
  const baseUrl = window.location.origin

  log('run: context', {
    integrationSlug,
    currency,
    productId: productId || '(none)',
    locale,
    baseUrl,
  })

  const greenspark = new window.GreensparkWidgets({
    locale,
    integrationSlug,
    isShopifyIntegration: true,
  })
  const cartApi = createCartApi(baseUrl, currency)

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
  log('run: found', targets.length, '.greenspark-widget-target element(s)')

  if (targets.length === 0) {
    warn('run: no .greenspark-widget-target in DOM – ensure template outputs a div with class greenspark-widget-target and id = base64(widgetType|widgetId)')
  }

  targets.forEach((target, index) => {
    const el = target as HTMLElement
    const rawId = el.id
    log('run: target', index + 1, 'id=', rawId, 'data-attrs=', {
      'data-integration-slug': el.getAttribute('data-integration-slug'),
      'data-currency': el.getAttribute('data-currency'),
    })
    el.querySelectorAll('.greenspark-widget-instance').forEach((e) => e.remove())
    let type: string
    try {
      ;[type] = atob(rawId).split('|')
      log('run: target', index + 1, 'decoded type=', type, 'EnumToWidgetTypeMap[type]=', EnumToWidgetTypeMap[type])
    } catch (e) {
      err('run: invalid widget id (not base64 type|widgetId):', rawId, e)
      return
    }
    const variant = EnumToWidgetTypeMap[type] as WidgetVariant | undefined
    if (!variant) {
      warn('run: unknown widget type', type, '– known types: 0–9 (see EnumToWidgetTypeMap)')
      return
    }
    const widgetId = rawId
    const containerSelector = getWidgetContainer(widgetId)
    log('run: rendering widget variant=', variant, 'widgetId=', widgetId, 'containerSelector=', containerSelector)
    renderWidget(ctx, variant, widgetId, containerSelector)
  })
}
