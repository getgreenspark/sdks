export const AVAILABLE_LOCALES = ['en', 'de'] as const
export const DEFAULT_LOCALE = 'en' as const

export const DEFAULT_CONTAINER_CSS_SELECTOR = '[data-greenspark-widget-container]' as const
export const WIDGET_TYPES = ['cart'] as const
export const WIDGET_COLORS = {
  cart: ['beige', 'green', 'blue', 'white', 'black'],
  spendLevel: ['beige', 'green', 'blue', 'white', 'black'],
} as const
