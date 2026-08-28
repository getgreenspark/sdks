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

export function isInsideCartDrawer(el: { closest: (selector: string) => unknown }): boolean {
  return CART_DRAWER_SELECTORS.some((selector) => el.closest(selector) != null)
}

export function partitionDrawerTargets<T extends { closest: (selector: string) => unknown }>(
  targets: Iterable<T>,
): { pageTargets: T[]; drawerTargets: T[] } {
  const pageTargets: T[] = []
  const drawerTargets: T[] = []
  for (const target of targets) {
    if (isInsideCartDrawer(target)) drawerTargets.push(target)
    else pageTargets.push(target)
  }
  return { pageTargets, drawerTargets }
}
