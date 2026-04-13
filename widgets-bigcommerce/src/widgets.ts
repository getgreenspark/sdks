import {err} from './debug'
import type {RunContext, WidgetByIdType, WidgetTargetConfig} from './interfaces'
import {movePopupToBody} from './dom'
import type {GreensparkCartWidgetKey} from './global'

function renderWithPopup(widgetId: string, render: () => Promise<unknown>): void {
  render()
    .then(() => movePopupToBody(widgetId))
    .catch((e: unknown) => {
      if ((e as { response?: unknown }).response === undefined) {
        err('render: renderWithPopup failed', widgetId, e)
      }
    })
}

function renderStats(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.topStats({
      color: config.color as never,
      withPopup: config.withPopup,
      popupTheme: config.popupTheme as never,
      containerSelector,
      useShadowDom,
      version,
    }).render(),
  )
}

function renderStatic(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.static({
      color: config.color as never,
      style: config.style as never,
      containerSelector,
      useShadowDom,
      version,
    }).render(),
  )
}

function renderPerOrder(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.perOrder({
      color: config.color as never,
      style: config.style as never,
      withPopup: config.withPopup,
      popupTheme: config.popupTheme as never,
      containerSelector,
      useShadowDom,
      version,
    }).render(),
  )
}

function renderPerProduct(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const {greenspark, productId, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.perProduct({
      color: config.color as never,
      style: config.style as never,
      withPopup: config.withPopup,
      popupTheme: config.popupTheme as never,
      productId,
      containerSelector,
      useShadowDom,
      version,
    }).render(),
  )
}

function renderCart(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const targetEl = document.getElementById(widgetId)
  if (!targetEl || !document.querySelector(containerSelector)) return

  const {
    cartApi,
    getWidgetContainer,
    movePopupToBody: moveFn,
    greenspark,
    useShadowDom,
    version
  } = ctx
  const {getCart} = cartApi
  const cartWidgetWindowKey = `greensparkCartWidget-${widgetId}` as GreensparkCartWidgetKey

  if (window[cartWidgetWindowKey]) {
    getCart()
      .then((order) => {
        if (order.lineItems.length <= 0) return
        const sel = getWidgetContainer(widgetId)
        if (!document.querySelector(sel)) return
        return window[cartWidgetWindowKey]!
          .render({order}, sel)
          .then(() => moveFn(widgetId))
          .catch((e: unknown) => err('render: cart render error', e))
      })
    return
  }

  getCart()
    .then((order) => {
      if (order.lineItems.length === 0) return
      const sel = getWidgetContainer(widgetId)
      if (!document.querySelector(sel)) return
      const widget = greenspark.cart({
          color: config.color as never,
          style: config.style as never,
          withPopup: config.withPopup,
          popupTheme: config.popupTheme as never,
          order,
          containerSelector: sel,
          useShadowDom,
          version,
        })
      ;(window as unknown as Record<string, unknown>)[cartWidgetWindowKey] = widget
      return widget
        .render({order}, sel)
        .then(() => moveFn(widgetId))
        .catch((e: Error) => err('render: cart widget render error', e))
    })
    .catch((e: unknown) => err('render: cart Error fetching cart:', e))
}

function renderSpendLevel(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const {greenspark, currency, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.spendLevel({
      color: config.color as never,
      style: config.style as never,
      withPopup: config.withPopup,
      popupTheme: config.popupTheme as never,
      currency,
      containerSelector,
      useShadowDom,
      version,
    }).render(),
  )
}

function renderTieredSpendLevel(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const {greenspark, currency, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.tieredSpendLevel({
      color: config.color as never,
      style: config.style as never,
      withPopup: config.withPopup,
      popupTheme: config.popupTheme as never,
      currency,
      containerSelector,
      useShadowDom,
      version,
    }).render(),
  )
}

function renderByPercentage(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.byPercentage({
      color: config.color as never,
      style: config.style as never,
      withPopup: config.withPopup,
      popupTheme: config.popupTheme as never,
      containerSelector,
      useShadowDom,
      version,
    }).render(),
  )
}

function renderByPercentageOfRevenue(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.byPercentageOfRevenue({
      color: config.color as never,
      style: config.style as never,
      withPopup: config.withPopup,
      popupTheme: config.popupTheme as never,
      containerSelector,
      useShadowDom,
      version,
    }).render(),
  )
}

function renderBanner(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.fullWidthBanner({
      options: [],
      imageUrl: config.imageUrl,
      title: config.title,
      description: config.description,
      callToActionUrl: config.ctaUrl,
      textColor: config.textColor,
      buttonBackgroundColor: config.buttonBgColor,
      buttonTextColor: config.buttonTextColor,
      containerSelector,
      useShadowDom,
      version,
    }).render(),
  )
}

/** Dispatch to the correct render function based on the widget type from Page Builder config. */
export function renderWidget(ctx: RunContext, config: WidgetTargetConfig, widgetId: string, containerSelector: string): void {
  const dispatch: Record<string, () => void> = {
    stats: () => renderStats(ctx, config, widgetId, containerSelector),
    static: () => renderStatic(ctx, config, widgetId, containerSelector),
    perOrder: () => renderPerOrder(ctx, config, widgetId, containerSelector),
    perProduct: () => renderPerProduct(ctx, config, widgetId, containerSelector),
    cart: () => renderCart(ctx, config, widgetId, containerSelector),
    spendLevel: () => renderSpendLevel(ctx, config, widgetId, containerSelector),
    tieredSpendLevel: () => renderTieredSpendLevel(ctx, config, widgetId, containerSelector),
    byPercentage: () => renderByPercentage(ctx, config, widgetId, containerSelector),
    byPercentageOfRevenue: () => renderByPercentageOfRevenue(ctx, config, widgetId, containerSelector),
    banner: () => renderBanner(ctx, config, widgetId, containerSelector),
  }
  const fn = dispatch[config.widgetType]
  if (!fn) {
    err('render: no renderer for widget type', config.widgetType)
    return
  }
  fn()
}

// ---------------------------------------------------------------------------
// Script + placement div: encoded element `id` + *ById API
// ---------------------------------------------------------------------------

function renderByIdOffsetPerOrder(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.perOrderById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderByIdOffsetByProduct(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, productId, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.perProductById({
      widgetId,
      productId,
      containerSelector,
      useShadowDom,
      version
    }).render(),
  )
}

function renderByIdOffsetBySpend(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, currency, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.spendLevelById({
      widgetId,
      currency,
      containerSelector,
      useShadowDom,
      version
    }).render(),
  )
}

function renderByIdOffsetByStoreRevenue(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, currency, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.tieredSpendLevelById({
      widgetId,
      currency,
      containerSelector,
      useShadowDom,
      version
    }).render(),
  )
}

function renderByIdByPercentage(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.byPercentageById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderByIdByPercentageOfRevenue(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.byPercentageOfRevenueById({
      widgetId,
      containerSelector,
      useShadowDom,
      version
    }).render(),
  )
}

function renderByIdStats(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.topStatsById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderByIdStatic(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.staticById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderByIdBanner(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.fullWidthBannerById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderByIdOrderImpacts(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const targetEl = document.getElementById(widgetId)
  if (!targetEl || !document.querySelector(containerSelector)) return

  const {
    cartApi,
    getWidgetContainer,
    movePopupToBody: moveFn,
    greenspark,
    useShadowDom,
    version
  } = ctx
  const {getCart} = cartApi
  const cartWidgetWindowKey = `greensparkCartWidget-${widgetId}` as GreensparkCartWidgetKey

  if (window[cartWidgetWindowKey]) {
    getCart()
      .then((order) => {
        if (order.lineItems.length <= 0) return
        const sel = getWidgetContainer(widgetId)
        if (!document.querySelector(sel)) return
        return window[cartWidgetWindowKey]!
          .render({order}, sel)
          .then(() => moveFn(widgetId))
          .catch((e: unknown) => err('render: order-impacts render error', e))
      })
    return
  }

  getCart()
    .then((order) => {
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
        .render({order}, sel)
        .then(() => moveFn(widgetId))
        .catch((e: Error) => err('render: order-impacts widget render error', e))
    })
    .catch((e: unknown) => err('render: order-impacts Error fetching cart:', e))
}

/**
 * Renders via *ById endpoints using the placement div `id` (base64 `enumDigit|widgetId`),
 */
export function renderWidgetById(ctx: RunContext, variant: WidgetByIdType, widgetId: string, containerSelector: string): void {
  const fns: Record<WidgetByIdType, () => void> = {
    orderImpacts: () => renderByIdOrderImpacts(ctx, widgetId, containerSelector),
    offsetPerOrder: () => renderByIdOffsetPerOrder(ctx, widgetId, containerSelector),
    offsetByProduct: () => renderByIdOffsetByProduct(ctx, widgetId, containerSelector),
    offsetBySpend: () => renderByIdOffsetBySpend(ctx, widgetId, containerSelector),
    offsetByStoreRevenue: () => renderByIdOffsetByStoreRevenue(ctx, widgetId, containerSelector),
    byPercentage: () => renderByIdByPercentage(ctx, widgetId, containerSelector),
    byPercentageOfRevenue: () => renderByIdByPercentageOfRevenue(ctx, widgetId, containerSelector),
    stats: () => renderByIdStats(ctx, widgetId, containerSelector),
    static: () => renderByIdStatic(ctx, widgetId, containerSelector),
    banner: () => renderByIdBanner(ctx, widgetId, containerSelector),
  }
  fns[variant]()
}
