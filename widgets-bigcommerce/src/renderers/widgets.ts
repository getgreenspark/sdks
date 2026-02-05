import type { RunContext, WidgetVariant } from './context'
import { renderOrderImpacts } from './order-impacts'

function renderWithPopup(ctx: RunContext, widgetId: string, _containerSelector: string, render: () => Promise<unknown>): void {
  render()
    .then(() => ctx.movePopupToBody(widgetId))
    .catch((e: unknown) => {
      if ((e as { response?: unknown }).response === undefined) {
        console.error('Greenspark Widget (BigCommerce) - ', e)
      }
    })
}

export function renderOffsetPerOrder(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, useShadowDom, version } = ctx
  renderWithPopup(ctx, widgetId, containerSelector, () =>
    greenspark.perOrderById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderOffsetByProduct(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, productId, useShadowDom, version } = ctx
  renderWithPopup(ctx, widgetId, containerSelector, () =>
    greenspark.perProductById({ widgetId, productId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderOffsetBySpend(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, currency, useShadowDom, version } = ctx
  renderWithPopup(ctx, widgetId, containerSelector, () =>
    greenspark.spendLevelById({ widgetId, currency, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderOffsetByStoreRevenue(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, currency, useShadowDom, version } = ctx
  renderWithPopup(ctx, widgetId, containerSelector, () =>
    greenspark.tieredSpendLevelById({ widgetId, currency, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderByPercentage(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, useShadowDom, version } = ctx
  renderWithPopup(ctx, widgetId, containerSelector, () =>
    greenspark.byPercentageById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderByPercentageOfRevenue(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, useShadowDom, version } = ctx
  renderWithPopup(ctx, widgetId, containerSelector, () =>
    greenspark.byPercentageOfRevenueById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderStats(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, useShadowDom, version } = ctx
  renderWithPopup(ctx, widgetId, containerSelector, () =>
    greenspark.topStatsById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderStatic(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, useShadowDom, version } = ctx
  renderWithPopup(ctx, widgetId, containerSelector, () =>
    greenspark.staticById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderBanner(ctx: RunContext, widgetId: string, containerSelector: string): void {
  const { greenspark, useShadowDom, version } = ctx
  renderWithPopup(ctx, widgetId, containerSelector, () =>
    greenspark.fullWidthBannerById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderWidget(ctx: RunContext, variant: WidgetVariant, widgetId: string, containerSelector: string): void {
  const fns = {
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
