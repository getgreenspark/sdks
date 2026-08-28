import type { GreensparkCartWidgetKey } from './global'
import type { RunContext, WidgetVariant } from './interfaces'
import { err, warn } from './debug'

const UNAUTHORIZED_SUPPRESSION_MS = 60_000

const inFlightRenders = new Set<string>()
const suppressedUntilByRenderKey = new Map<string, number>()
const cartRefreshGenByTarget = new Map<string, number>()

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

function renderWithPopup(
  target: HTMLElement,
  variant: WidgetVariant,
  movePopupToBody: (target: HTMLElement) => void,
  render: () => Promise<unknown>,
): void {
  const renderKey = `${variant}:${target.id}`
  if (inFlightRenders.has(renderKey) || shouldSuppress(renderKey)) return

  inFlightRenders.add(renderKey)
  render()
    .then(() => {
      inFlightRenders.delete(renderKey)
      movePopupToBody(target)
    })
    .catch((error: unknown) => {
      inFlightRenders.delete(renderKey)
      rememberUnauthorized(renderKey, error)
      if ((error as { response?: unknown }).response === undefined) {
        err('widgets: render failed', variant, target.id, error)
      }
    })
}

export function renderOffsetPerOrder(
  ctx: RunContext,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(target, 'offsetPerOrder', movePopupToBody, () =>
    greenspark.perOrderById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderOffsetByProduct(
  ctx: RunContext,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, movePopupToBody, productId, useShadowDom, version } = ctx
  renderWithPopup(target, 'offsetByProduct', movePopupToBody, () =>
    greenspark.perProductById({ widgetId, productId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderOffsetBySpend(
  ctx: RunContext,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, currency, movePopupToBody, useShadowDom, version } = ctx
  if (!currency) {
    warn('widgets: skip spend-level widget; missing ISO currency')
    return
  }
  renderWithPopup(target, 'offsetBySpend', movePopupToBody, () =>
    greenspark.spendLevelById({ widgetId, currency, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderOffsetByStoreRevenue(
  ctx: RunContext,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, currency, movePopupToBody, useShadowDom, version } = ctx
  if (!currency) {
    warn('widgets: skip tiered spend-level widget; missing ISO currency')
    return
  }
  renderWithPopup(target, 'offsetByStoreRevenue', movePopupToBody, () =>
    greenspark.tieredSpendLevelById({ widgetId, currency, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderByPercentage(
  ctx: RunContext,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(target, 'byPercentage', movePopupToBody, () =>
    greenspark.byPercentageById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderByPercentageOfRevenue(
  ctx: RunContext,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(target, 'byPercentageOfRevenue', movePopupToBody, () =>
    greenspark.byPercentageOfRevenueById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderStats(
  ctx: RunContext,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(target, 'stats', movePopupToBody, () =>
    greenspark.topStatsById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderStatic(
  ctx: RunContext,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(target, 'static', movePopupToBody, () =>
    greenspark.staticById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

export function renderBanner(
  ctx: RunContext,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const { greenspark, movePopupToBody, useShadowDom, version } = ctx
  renderWithPopup(target, 'banner', movePopupToBody, () =>
    greenspark.fullWidthBannerById({ widgetId, containerSelector, useShadowDom, version }).render(),
  )
}

/** SHOPLINE cannot add Greenspark contribution SKUs — drop the checkbox if the HTML API injects one. */
function stripContributionUi(root: ParentNode): void {
  root.querySelectorAll("input[name='customerCartContribution']").forEach((checkbox) => {
    const row = checkbox.closest('label, p, div, li') || checkbox
    row.remove()
  })
}

export function renderOrderImpacts(
  ctx: RunContext,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const renderKey = `orderImpacts:${target.id}`
  // Do not skip in-flight refreshes: an early return would skip the gen bump,
  // so a newer cart never paints (stale last-write-wins). Overlapping
  // getCart/render is allowed; isCurrent() no-ops stale work.
  if (shouldSuppress(renderKey)) return
  if (!document.querySelector(containerSelector)) return

  const {
    cartApi,
    getWidgetContainer,
    movePopupToBody,
    clearWidgetMount,
    greenspark,
    useShadowDom,
    version,
  } = ctx
  const cartWidgetWindowKey = `greensparkCartWidget-${target.id}` as GreensparkCartWidgetKey

  const gen = (cartRefreshGenByTarget.get(target.id) ?? 0) + 1
  cartRefreshGenByTarget.set(target.id, gen)
  const isCurrent = (): boolean => cartRefreshGenByTarget.get(target.id) === gen

  const existingWidget = window[cartWidgetWindowKey]
  cartApi
    .getOrder()
    .then((order) => {
      if (!isCurrent()) return undefined
      if (!order || order.lineItems.length === 0) {
        clearWidgetMount(target)
        return undefined
      }

      const selector = getWidgetContainer(target)
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

      return widget.render({ order }, selector).then(() => {
        if (!isCurrent()) return
        stripContributionUi(target)
        movePopupToBody(target)
      })
    })
    .catch((error: unknown) => {
      rememberUnauthorized(renderKey, error)
      err('widgets: order-impacts render error', error)
    })
}

export function renderWidget(
  ctx: RunContext,
  variant: WidgetVariant,
  target: HTMLElement,
  widgetId: string,
  containerSelector: string,
): void {
  const fns: Record<WidgetVariant, () => void> = {
    orderImpacts: () => renderOrderImpacts(ctx, target, widgetId, containerSelector),
    offsetPerOrder: () => renderOffsetPerOrder(ctx, target, widgetId, containerSelector),
    offsetByProduct: () => renderOffsetByProduct(ctx, target, widgetId, containerSelector),
    offsetBySpend: () => renderOffsetBySpend(ctx, target, widgetId, containerSelector),
    offsetByStoreRevenue: () => renderOffsetByStoreRevenue(ctx, target, widgetId, containerSelector),
    byPercentage: () => renderByPercentage(ctx, target, widgetId, containerSelector),
    byPercentageOfRevenue: () => renderByPercentageOfRevenue(ctx, target, widgetId, containerSelector),
    stats: () => renderStats(ctx, target, widgetId, containerSelector),
    static: () => renderStatic(ctx, target, widgetId, containerSelector),
    banner: () => renderBanner(ctx, target, widgetId, containerSelector),
  }
  fns[variant]()
}
