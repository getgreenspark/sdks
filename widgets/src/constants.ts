export const AVAILABLE_LOCALES: Readonly<string[]> = ['en', 'de']
export const AVAILABLE_STORE_CURRENCIES: Readonly<string[]> = ['USD', 'GBP', 'EUR', 'AUD', 'NZD']

export const WIDGET_TYPES: Readonly<string[]> = ['cart']
export const WIDGET_COLORS: Readonly<Record<(typeof WIDGET_TYPES)[number], string[]>> = {
  cart: ['beige', 'green', 'blue', 'white', 'black'],
}
