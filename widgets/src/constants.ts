export const AVAILABLE_LOCALES = ['en', 'de', 'fr'] as const
export const DEFAULT_LOCALE = 'en' as const

export const DEFAULT_CONTAINER_CSS_SELECTOR = '[data-greenspark-widget-container]' as const

export const WIDGET_TYPES = ['cart'] as const
export const WIDGET_STYLES = ['default', 'simplified'] as const
export const WIDGET_COLORS_V1 = ['beige', 'green', 'blue', 'white', 'black'] as const
export const POPUP_THEMES = ['light', 'dark'] as const
export const IMPACT_TYPES = ['trees', 'plastic', 'carbon', 'kelp', 'water', 'bees'] as const
export const WIDGET_COLORS = [
  'beige',
  'green',
  'blue',
  'white',
  'black',
  'grey',
  'transparent',
] as const
export const AVAILABLE_STATISTIC_TYPES = [
  ...IMPACT_TYPES,
  'monthsEarthPositive',
  'straws',
  'miles',
  'footballPitches',
] as const
