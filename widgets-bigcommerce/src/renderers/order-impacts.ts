import { log, err } from '../debug'
import type { GreensparkCartWidgetKey } from '../global.d'
import type { RunContext } from './context'

const checkboxSelector = "input[name='customerCartContribution']"

function getCheckbox(): HTMLInputElement | null {
  return document.querySelector<HTMLInputElement>(checkboxSelector)
}

export function renderOrderImpacts(ctx: RunContext, widgetId: string, containerSelector: string): void {
  log('render: renderOrderImpacts', { widgetId, containerSelector })
  const targetEl = document.getElementById(widgetId)
  if (!targetEl || !document.querySelector(containerSelector)) {
    log('render: renderOrderImpacts – no target or container, skipping', { hasTarget: !!targetEl, hasContainer: !!document.querySelector(containerSelector) })
    return
  }

  const { cartApi, parseCart, getWidgetContainer, movePopupToBody, greenspark, useShadowDom, version, refreshCartUI } = ctx
  const { getCart, addItemToCart, updateCart } = cartApi

  const prevChecked = getCheckbox()?.checked
  const cartWidgetWindowKey = `greensparkCartWidget-${widgetId}` as GreensparkCartWidgetKey

  const ensureHandlers = () => {
    const WIDGET_PRESELECT_OPT_OUT_KEY = 'greenspark-preselect-optout'
    const isWidgetPreselectOptedOut = () => localStorage.getItem(WIDGET_PRESELECT_OPT_OUT_KEY) === '1'
    const setWidgetPreselectOptOut = () => localStorage.setItem(WIDGET_PRESELECT_OPT_OUT_KEY, '1')
    const clearWidgetPreselectOptOut = () => localStorage.removeItem(WIDGET_PRESELECT_OPT_OUT_KEY)

    const updateCheckboxState = (checkbox: HTMLInputElement, pid: string) => {
      getCart()
        .then((cart) => {
          const matching = cart.items.some((item) => String(item.productId) === pid)
          checkbox.checked = matching
        })
        .catch((e) => err('render: order-impacts Error checking cart:', e))
    }

    const bindCheckbox = () => {
      if (window._greensparkCheckboxHandlerBound) return
      window._greensparkCheckboxHandlerBound = true
      document.addEventListener('change', (e) => {
        const checkbox = (e.target as HTMLElement)?.closest<HTMLInputElement>(checkboxSelector)
        if (!checkbox) return
        const pid = checkbox.getAttribute('data-greenspark-product-external-id')
        if (!pid || pid === 'PREVIEW_EXTERNAL_ID') return
        if (checkbox.checked) {
          clearWidgetPreselectOptOut()
          getCart()
            .then((cart) => {
              if (cart.items.some((item) => String(item.productId) === pid)) return
              return addItemToCart(pid, 1).then(() => refreshCartUI())
            })
            .catch((e) => err('render: order-impacts add error', e))
        } else {
          setWidgetPreselectOptOut()
          getCart()
            .then((cart) => {
              if (!cart.items.some((item) => String(item.productId) === pid)) return
              return updateCart({ [pid]: 0 }).then(() => refreshCartUI())
            })
            .catch((e) => err('render: order-impacts remove error', e))
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
        const pid = checkbox.getAttribute('data-greenspark-product-external-id')
        if (!pid) return
        setWidgetPreselectOptOut()
        setTimeout(() => updateCheckboxState(checkbox, pid), 400)
      })
    }

    const initCheckboxState = () => {
      const checkbox = getCheckbox()
      if (!checkbox) return
      const pid = checkbox.getAttribute('data-greenspark-product-external-id')?.trim()
      if (!pid || pid === 'PREVIEW_EXTERNAL_ID') return
      const preSelected = checkbox.getAttribute('data-greenspark-widget-pre-selected') === 'true'
      if (!preSelected || isWidgetPreselectOptedOut()) {
        getCart()
          .then((cart) => {
            checkbox.checked = cart.items.some((item) => String(item.productId) === pid)
          })
          .catch((e) => err('render: order-impacts getCart error', e))
        return
      }
      getCart()
        .then((cart) => {
          if (cart.items.some((item) => String(item.productId) === pid)) {
            checkbox.checked = true
            return
          }
          return addItemToCart(pid, 1).then(() => {
            checkbox.checked = true
            refreshCartUI()
          })
        })
        .catch((e) => {
          err('render: order-impacts preselect error', e)
          setWidgetPreselectOptOut()
          checkbox.checked = false
        })
    }

    bindCheckbox()
    bindRemove()
    initCheckboxState()
  }

  if (window[cartWidgetWindowKey]) {
    getCart()
      .then((updatedCart) => {
        const order = parseCart(updatedCart)
        if (order.lineItems.length <= 0) return
        const sel = getWidgetContainer(widgetId)
        if (!document.querySelector(sel)) return
        return window[cartWidgetWindowKey]!
          .render({ order }, sel)
          .then(() => movePopupToBody(widgetId))
          .then(() => {
            if (typeof prevChecked === 'boolean') {
              const cb = getCheckbox()
              if (cb) cb.checked = prevChecked
            }
          })
          .then(ensureHandlers)
          .catch((e: unknown) => err('render: order-impacts render error', e))
      })
    return
  }

  getCart()
    .then((cartData) => {
      const order = parseCart(cartData)
      if (order.lineItems.length === 0) return
      const sel = getWidgetContainer(widgetId)
      if (!document.querySelector(sel)) return
      const widget = greenspark.cartById({
        widgetId,
        containerSelector: sel,
        useShadowDom,
        order,
        version,
      })
      ;(window as unknown as Record<string, unknown>)[cartWidgetWindowKey] = widget
      return widget
        .render({ order }, sel)
        .then(() => movePopupToBody(widgetId))
        .then(ensureHandlers)
        .catch((e: Error) => err('render: order-impacts widget render error', e))
    })
    .catch((e: unknown) => err('render: order-impacts Error fetching cart:', e))
}
