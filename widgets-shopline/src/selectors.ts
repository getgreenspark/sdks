export const TARGET_SELECTOR = '.greenspark-widget-target'

/** OS 3.0 cart drawer is overlay chrome, not a theme-editor template. */
export const CART_DRAWER_SELECTORS = [
  '[data-cart-type="drawer"]',
  '[data-cart-drawer]',
  '.cart-drawer',
  '#cart-drawer',
  '.mini-cart',
  '#mini-cart',
  '[class*="cart-drawer"]',
  '[class*="CartDrawer"]',
] as const

/** Prefer inserting the widget above checkout / footer controls. */
export const CART_DRAWER_INJECT_ANCHORS = [
  '[data-cart-footer]',
  '.cart-drawer__footer',
  '.cart-footer',
  '[class*="cart-footer"]',
  '[class*="CartFooter"]',
  'a[href*="checkout"]',
  'button[name="checkout"]',
] as const
