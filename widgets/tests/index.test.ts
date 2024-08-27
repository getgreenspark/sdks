import { DEFAULT_LOCALE } from '@/constants'
import GreensparkWidgets from '@/index'
import { CartWidget } from '@/widgets'

import apiFixtures from '@fixtures/api.json'
import orderFixture from '@fixtures/order.json'

import type { StoreOrder } from '@/interfaces'
import { SpendLevelWidget } from '@/widgets/spendLevel'

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string
const EMPTY_ORDER = orderFixture.empty as StoreOrder

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
    const cart = widgets.cart({ color: 'beige', order: EMPTY_ORDER })
    expect(cart instanceof CartWidget).toBe(true)
  })

  test('can access the spend level widget', () => {
    const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
    expect(typeof widgets.spendLevel).toEqual('function')
    const spendLevel = widgets.spendLevel({ color: 'beige', currency: 'EUR' })
    expect(spendLevel instanceof SpendLevelWidget).toBe(true)
  })
})
