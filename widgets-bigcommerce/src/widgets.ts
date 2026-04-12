import {err} from './debug'
import type {RunContext, WidgetTargetConfig} from './interfaces'
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
