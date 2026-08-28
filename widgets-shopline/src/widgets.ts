import type { GreensparkCartWidgetKey } from './global'
import type { RunContext, ShoplineCart, WidgetVariant } from './interfaces'
import { skuIdOf } from './cart'
import { cleanupPopups } from './dom'
import { err } from './debug'

const WIDGET_PRESELECT_OPT_OUT_KEY = 'greenspark-preselect-optout'
const PREVIEW_EXTERNAL_ID = 'PREVIEW_EXTERNAL_ID'
const UNAUTHORIZED_SUPPRESSION_MS = 60_000

const inFlightRenders = new Set<string>()
const suppressedUntilByRenderKey = new Map<string, number>()

function getHttpStatus(error: unknown): number | undefined {
  if (error instanceof Response) return error.status

  const maybeError = error as { response?: { status?: unknown } }
  return typeof maybeError.response?.status === 'number' ? maybeError.response.status : undefined
}

function shouldSuppress(renderKey: string): boolean {
  const suppressedUntil = suppressedUntilByRenderKey.get(renderKey)
  if (!suppressedUntil) return false

  if (Date.now() > suppressedUntil) {
    suppressedUntilByRenderKey.delete(renderKey)
    return false
  }

  return true
}

function rememberUnauthorized(renderKey: string, error: unknown): void {
  const status = getHttpStatus(error)
  if (status === 401 || status === 403) {
    suppressedUntilByRenderKey.set(renderKey, Date.now() + UNAUTHORIZED_SUPPRESSION_MS)
  }
}

function cartHasSku(cart: ShoplineCart, skuId: string): boolean {
  return cart.items.some((item) => skuIdOf(item) === skuId)
}

function renderWithPopup(
  widgetId: string,
  variant: WidgetVariant,
  movePopupToBody: (widgetId: string) => void,
  render: () => Promise<unknown>,
): void {
  const renderKey = `${variant}:${widgetId}`
  if (inFlightRenders.has(renderKey) || shouldSuppress(renderKey)) return

  inFlightRenders.add(renderKey)
  render()
    .then(() => {
      inFlightRenders.delete(renderKey)
      movePopupToBody(widgetId)
    })
    .catch((error: unknown) => {
      inFlightRenders.delete(renderKey)
      rememberUnauthorized(renderKey, error)
      if ((error as { response?: unknown }).response === undefined) {
        err('widgets: render failed', variant, widgetId, error)
      }
    })
}

export function renderOffsetPerOrder(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(widgetId, 'offsetPerOrder', movePopupToBody, () =>
    greenspark.perOrderById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderOffsetByProduct(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, movePopupToBody, productId, useShadowDom, version } = ctx
  renderWithPopup(widgetId, 'offsetByProduct', movePopupToBody, () =>
    greenspark.perProductById({ widgetId, productId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderOffsetBySpend(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, currency, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(widgetId, 'offsetBySpend', movePopupToBody, () =>
    greenspark.spendLevelById({ widgetId, currency, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderOffsetByStoreRevenue(
  ctx: RunContext,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, currency, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(widgetId, 'offsetByStoreRevenue', movePopupToBody, () =>
    greenspark.tieredSpendLevelById({ widgetId, currency, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderByPercentage(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(widgetId, 'byPercentage', movePopupToBody, () =>
    greenspark.byPercentageById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderByPercentageOfRevenue(
  ctx: RunContext,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(widgetId, 'byPercentageOfRevenue', movePopupToBody, () =>
    greenspark.byPercentageOfRevenueById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderStats(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(widgetId, 'stats', movePopupToBody, () =>
    greenspark.topStatsById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderStatic(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(widgetId, 'static', movePopupToBody, () =>
    greenspark.staticById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderBanner(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(widgetId, 'banner', movePopupToBody, () =>
    greenspark.fullWidthBannerById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

function isWidgetPreselectOptedOut(): boolean {
  try {
    return localStorage.getItem(WIDGET_PRESELECT_OPT_OUT_KEY) === '1'
  } catch {
    return false
  }
}

function setWidgetPreselectOptOut(): void {
  localStorage.setItem(WIDGET_PRESELECT_OPT_OUT_KEY, '1')
}

function clearWidgetPreselectOptOut(): void {
  localStorage.removeItem(WIDGET_PRESELECT_OPT_OUT_KEY)
}

export function renderOrderImpacts(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const renderKey = `orderImpacts:${widgetId}`
  if (inFlightRenders.has(renderKey) || shouldSuppress(renderKey)) return

  const targetEl = (document.getElementById(widgetId) ??
    document.querySelector(`[data-gs-widget-id="${CSS.escape(widgetId)}"]`)) as HTMLElement | null
  if (!targetEl || !document.querySelector(containerSelector)) return

  const { cartApi, getWidgetContainer, movePopupToBody, greenspark, useShadowDom, version } = ctx
  const checkboxSelector = "input[name='customerCartContribution']"
  const getCheckbox = (): HTMLInputElement | null => document.querySelector(checkboxSelector)
  const prevChecked = getCheckbox()?.checked
  const cartWidgetWindowKey = `greensparkCartWidget-${targetEl.id}` as GreensparkCartWidgetKey

  const updateCheckboxState = (checkbox: HTMLInputElement, productId: string): void => {
    cartApi
      .getCart()
      .then((cart) => {
        checkbox.checked = cartHasSku(cart, productId)
      })
      .catch((error: unknown) => err('widgets: Error checking cart state:', error))
  }

  const bindCheckbox = (): void => {
    if (window._greensparkCheckboxHandlerBound) return
    window._greensparkCheckboxHandlerBound = true
    document.addEventListener('change', (event) => {
      const checkbox = (event.target as HTMLElement)?.closest<HTMLInputElement>(checkboxSelector)
      if (!checkbox) return

      const productId = checkbox.getAttribute('data-greenspark-product-external-id')
      if (!productId || productId === PREVIEW_EXTERNAL_ID) return

      if (checkbox.checked) {
        clearWidgetPreselectOptOut()
        cartApi
          .getCart()
          .then((cart) => {
            if (cartHasSku(cart, productId)) return undefined
            return cartApi.addItemToCart(productId, 1).then(() => cartApi.refreshCartDrawer())
          })
          .catch((error: unknown) => err('widgets: add error', error))
        return
      }

      setWidgetPreselectOptOut()
      cartApi
        .getCart()
        .then((cart) => {
          if (!cartHasSku(cart, productId)) return undefined
          return cartApi.updateCart({ [productId]: 0 })
        })
        .then((response) => {
          if (response?.ok) cartApi.refreshCartDrawer()
        })
        .catch((error: unknown) => err('widgets: remove error', error))
    })
  }

  const bindRemove = (): void => {
    if (window._greensparkRemoveHandlerBound) return
    window._greensparkRemoveHandlerBound = true
    document.addEventListener('click', (event) => {
      const removeEl = (event.target as HTMLElement)?.closest(
        'cart-remove-button, .cart-remove-button, [data-cart-remove], [class*="cart-remove"]',
      )
      if (!removeEl) return
      const checkbox = getCheckbox()
      if (!checkbox) return
      const productId = checkbox.getAttribute('data-greenspark-product-external-id')
      if (!productId) return
      setWidgetPreselectOptOut()
      setTimeout(() => updateCheckboxState(checkbox, productId), 400)
    })
  }

  const initCheckboxState = (): void => {
    const checkbox = getCheckbox()
    if (!checkbox) return
    const productId = checkbox.getAttribute('data-greenspark-product-external-id')?.trim()
    if (!productId) return

    const preSelectedAttr = checkbox.getAttribute('data-greenspark-widget-pre-selected')
    const shouldAttemptPreselectAdd =
      preSelectedAttr === 'true' && productId !== PREVIEW_EXTERNAL_ID && !isWidgetPreselectOptedOut()

    if (!shouldAttemptPreselectAdd) {
      cartApi
        .getCart()
        .then((cart) => {
          checkbox.checked = cartHasSku(cart, productId)
        })
        .catch((error: unknown) => err('widgets: getCart error', error))
      return
    }

    if (!window._greensparkPreselectAddInProgress) window._greensparkPreselectAddInProgress = {}
    const preselectAddInProgressByProductId = window._greensparkPreselectAddInProgress
    if (preselectAddInProgressByProductId[productId]) return
    preselectAddInProgressByProductId[productId] = true

    cartApi
      .getCart()
      .then((cart) => {
        const present = cartHasSku(cart, productId)
        if (present) {
          checkbox.checked = true
          return undefined
        }

        return cartApi
          .addItemToCart(productId, 1)
          .then(() => {
            checkbox.checked = true
            cartApi.refreshCartDrawer()
          })
          .catch((error: unknown) => {
            err('widgets: pre-selected add error', error)
            setWidgetPreselectOptOut()
            checkbox.checked = false
          })
      })
      .catch((error: unknown) => err('widgets: getCart error', error))
      .finally(() => {
        preselectAddInProgressByProductId[productId] = undefined
      })
  }

  const ensureHandlers = (): void => {
    bindCheckbox()
    bindRemove()
    initCheckboxState()
  }

  inFlightRenders.add(renderKey)
  const existingWidget = window[cartWidgetWindowKey]
  const renderPromise = cartApi.getOrder().then((order) => {
    if (order.lineItems.length === 0) {
      cleanupPopups()
      return undefined
    }

    const selector = getWidgetContainer(targetEl)
    if (!document.querySelector(selector)) return undefined

    const widget =
      existingWidget ??
      greenspark.cartById({
        widgetId,
        containerSelector: selector,
        useShadowDom,
        order,
        version,
      })

    window[cartWidgetWindowKey] = widget

    return widget
      .render({ order }, selector)
      .then(() => {
        movePopupToBody(widgetId)
        if (typeof prevChecked === 'boolean') {
          const checkbox = getCheckbox()
          if (checkbox) checkbox.checked = prevChecked
        }
      })
      .then(ensureHandlers)
  })

  renderPromise
    .catch((error: unknown) => {
      rememberUnauthorized(renderKey, error)
      err('widgets: order-impacts render error', error)
    })
    .finally(() => {
      inFlightRenders.delete(renderKey)
    })
}

export function renderWidget(
  ctx: RunContext,
  variant: WidgetVariant,
  widgetId: string,
  containerSelector: string,
): void {
  const fns: Record<WidgetVariant, () => void> = {
    orderImpacts: () => renderOrderImpacts(ctx, widgetId, containerSelector),
    offsetPerOrder: () => renderOffsetPerOrder(ctx, widgetId, containerSelector),
    offsetByProduct: () => renderOffsetByProduct(ctx, widgetId, containerSelector),
    offsetBySpend: () => renderOffsetBySpend(ctx, widgetId, containerSelector),
    offsetByStoreRevenue: () => renderOffsetByStoreRevenue(ctx, widgetId, containerSelector),
    byPercentage: () => renderByPercentage(ctx, widgetId, containerSelector),
    byPercentageOfRevenue: () => renderByPercentageOfRevenue(ctx, widgetId, containerSelector),
    stats: () => renderStats(ctx, widgetId, containerSelector),
    static: () => renderStatic(ctx, widgetId, containerSelector),
    banner: () => renderBanner(ctx, widgetId, containerSelector),
  }
  fns[variant]()
}
