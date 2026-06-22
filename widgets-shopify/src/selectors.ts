export const TARGET_SELECTOR = '.greenspark-widget-target'

export const CART_DRAWER_SELECTORS = [
  'cart-drawer',
  '#CartDrawer',
  '[data-section-type="cart-drawer"]',
  '#mini-cart',
] as const

export const CART_REFRESH_SELECTORS = {
  cartDrawerForm: '#CartDrawer-Form',
  cartDrawer: '#CartDrawer',
  miniCartForm: '#mini-cart-form',
  miniCart: '#mini-cart',
  mainCartItems: '#main-cart-items',
  mainCart: '#main-cart',
  interactiveCart: 'interactive-cart',
  cartItemsForm: 'cart-items[form-id]',
} as const
