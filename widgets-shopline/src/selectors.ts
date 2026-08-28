export const TARGET_SELECTOR = '.greenspark-widget-target'

/** Painted mount child created by getWidgetContainer. Missing after theme innerHTML swaps. */
export const WIDGET_INSTANCE_SELECTOR = '.greenspark-widget-instance'

/** Shopline OS 2.0 cart drawer / checkout footer. Themes rebuild these with innerHTML. */
export const CART_DRAWER_SELECTORS = ['theme-cart-drawer', 'theme-cart-fixed-checkout'] as const

export function collectUnmountedTargets<T extends { querySelector: (selector: string) => unknown }>(
  targets: Iterable<T>,
): T[] {
  return [...targets].filter((target) => target.querySelector(WIDGET_INSTANCE_SELECTOR) == null)
}
