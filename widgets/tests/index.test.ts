import { DEFAULT_LOCALE } from '@/constants'
import GreensparkWidgets from '@/index'
import { CartWidget } from '@/widgets'

import apiFixtures from '@fixtures/api.json'
import cartFixtures from '@fixtures/cart.json'

import type { StoreOrder } from '@/interfaces'

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string
const EMPTY_CART = cartFixtures.empty as StoreOrder

describe('GreensparkWidgets', () => {
  test('can initialize the package through import', () => {
    const widgets = new GreensparkWidgets({ apiKey: API_KEY })
    expect(widgets instanceof GreensparkWidgets).toBe(true)
    expect(widgets.apiKey).toEqual(API_KEY)
    expect(widgets.currentLocale).toEqual(DEFAULT_LOCALE)
    expect(widgets.shopUniqueName).toBeUndefined()
  })

  test('can initialize the package through the window object', () => {
    const widgets = new window.GreensparkWidgets({ apiKey: API_KEY })
    expect(widgets instanceof GreensparkWidgets).toBe(true)
    expect(widgets.apiKey).toEqual(API_KEY)
    expect(widgets.currentLocale).toEqual(DEFAULT_LOCALE)
    expect(widgets.shopUniqueName).toBeUndefined()
  })

  test('can initialize the package in german', () => {
    const widgets = new GreensparkWidgets({ apiKey: API_KEY, locale: 'de' })
    expect(widgets.currentLocale).toEqual('de')
  })

  test('can access the cart widget', () => {
    const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
    expect(typeof widgets.cart).toEqual('function')
    const cart = widgets.cart({ color: 'beige', order: EMPTY_CART })
    expect(cart instanceof CartWidget).toBe(true)
  })
})
