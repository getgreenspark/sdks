import {err} from './debug'
import type {LegacyWidgetVariant, RunContext, WidgetTargetConfig} from './interfaces'
import {movePopupToBody} from './dom'
import type {GreensparkCartWidgetKey} from './global'

function renderWithPopup(targetId: string, render: () => Promise<unknown>): void {
  render()
    .then(() => movePopupToBody(targetId))
    .catch((e: unknown) => {
      if ((e as {response?: unknown}).response === undefined) {
        err('render: renderWithPopup failed', targetId, e)
      }
    })
}

function renderStats(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(targetId, () =>
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

function renderStatic(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(targetId, () =>
    greenspark.static({
      color: config.color as never,
      style: config.style as never,
      containerSelector,
      useShadowDom,
      version,
    }).render(),
  )
}

function renderPerOrder(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(targetId, () =>
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

function renderPerProduct(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const {greenspark, productId, useShadowDom, version} = ctx
  renderWithPopup(targetId, () =>
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

function renderCart(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const targetEl = document.getElementById(targetId)
  if (!targetEl || !document.querySelector(containerSelector)) return

  const {cartApi, getWidgetContainer, movePopupToBody: moveFn, greenspark, useShadowDom, version} = ctx
  const {getCart} = cartApi
  const cartWidgetWindowKey = `greensparkCartWidget-${targetId}` as GreensparkCartWidgetKey

  if (window[cartWidgetWindowKey]) {
    getCart()
      .then((order) => {
        if (order.lineItems.length <= 0) return
        const sel = getWidgetContainer(targetId)
        if (!document.querySelector(sel)) return
        return window[cartWidgetWindowKey]!
          .render({order}, sel)
          .then(() => moveFn(targetId))
          .catch((e: unknown) => err('render: cart render error', e))
      })
    return
  }

  getCart()
    .then((order) => {
      if (order.lineItems.length === 0) return
      const sel = getWidgetContainer(targetId)
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
        .then(() => moveFn(targetId))
        .catch((e: Error) => err('render: cart widget render error', e))
    })
    .catch((e: unknown) => err('render: cart Error fetching cart:', e))
}

function renderSpendLevel(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const {greenspark, currency, useShadowDom, version} = ctx
  renderWithPopup(targetId, () =>
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

function renderTieredSpendLevel(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const {greenspark, currency, useShadowDom, version} = ctx
  renderWithPopup(targetId, () =>
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

function renderByPercentage(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(targetId, () =>
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

function renderByPercentageOfRevenue(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(targetId, () =>
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

function renderBanner(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(targetId, () =>
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
export function renderWidget(ctx: RunContext, config: WidgetTargetConfig, targetId: string, containerSelector: string): void {
  const dispatch: Record<string, () => void> = {
    stats: () => renderStats(ctx, config, targetId, containerSelector),
    static: () => renderStatic(ctx, config, targetId, containerSelector),
    perOrder: () => renderPerOrder(ctx, config, targetId, containerSelector),
    perProduct: () => renderPerProduct(ctx, config, targetId, containerSelector),
    cart: () => renderCart(ctx, config, targetId, containerSelector),
    spendLevel: () => renderSpendLevel(ctx, config, targetId, containerSelector),
    tieredSpendLevel: () => renderTieredSpendLevel(ctx, config, targetId, containerSelector),
    byPercentage: () => renderByPercentage(ctx, config, targetId, containerSelector),
    byPercentageOfRevenue: () => renderByPercentageOfRevenue(ctx, config, targetId, containerSelector),
    banner: () => renderBanner(ctx, config, targetId, containerSelector),
  }
  const fn = dispatch[config.widgetType]
  if (!fn) {
    err('render: no renderer for widget type', config.widgetType)
    return
  }
  fn()
}

// ---------------------------------------------------------------------------
// Legacy: base64 element `id` (type digit | widget id) + *ById API
// ---------------------------------------------------------------------------

function renderLegacyOffsetPerOrder(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.perOrderById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderLegacyOffsetByProduct(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, productId, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.perProductById({widgetId, productId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderLegacyOffsetBySpend(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, currency, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.spendLevelById({widgetId, currency, containerSelector, useShadowDom, version}).render(),
  )
}

function renderLegacyOffsetByStoreRevenue(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, currency, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.tieredSpendLevelById({widgetId, currency, containerSelector, useShadowDom, version}).render(),
  )
}

function renderLegacyByPercentage(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.byPercentageById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderLegacyByPercentageOfRevenue(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.byPercentageOfRevenueById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderLegacyStats(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.topStatsById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderLegacyStatic(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.staticById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderLegacyBanner(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const {greenspark, useShadowDom, version} = ctx
  renderWithPopup(widgetId, () =>
    greenspark.fullWidthBannerById({widgetId, containerSelector, useShadowDom, version}).render(),
  )
}

function renderLegacyOrderImpacts(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const targetEl = document.getElementById(widgetId)
  if (!targetEl || !document.querySelector(containerSelector)) return

  const {cartApi, getWidgetContainer, movePopupToBody: moveFn, greenspark, useShadowDom, version} = ctx
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

/** Renders a widget placed with the pre-Page Builder pattern (`id` = base64 `"<digit>|<id>"`). */
export function renderLegacyWidget(ctx: RunContext, variant: LegacyWidgetVariant, widgetId: string, containerSelector: string): void {
  const fns: Record<LegacyWidgetVariant, () => void> = {
    orderImpacts: () => renderLegacyOrderImpacts(ctx, widgetId, containerSelector),
    offsetPerOrder: () => renderLegacyOffsetPerOrder(ctx, widgetId, containerSelector),
    offsetByProduct: () => renderLegacyOffsetByProduct(ctx, widgetId, containerSelector),
    offsetBySpend: () => renderLegacyOffsetBySpend(ctx, widgetId, containerSelector),
    offsetByStoreRevenue: () => renderLegacyOffsetByStoreRevenue(ctx, widgetId, containerSelector),
    byPercentage: () => renderLegacyByPercentage(ctx, widgetId, containerSelector),
    byPercentageOfRevenue: () => renderLegacyByPercentageOfRevenue(ctx, widgetId, containerSelector),
    stats: () => renderLegacyStats(ctx, widgetId, containerSelector),
    static: () => renderLegacyStatic(ctx, widgetId, containerSelector),
    banner: () => renderLegacyBanner(ctx, widgetId, containerSelector),
  }
  fns[variant]()
}
