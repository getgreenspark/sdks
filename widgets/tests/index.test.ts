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
const BASIC_ORDER = orderFixture.basic as StoreOrder

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

  test('can initialize the package in english and change it to german', () => {
    const widgets = new GreensparkWidgets({ apiKey: API_KEY, locale: 'en' })
    expect(widgets.currentLocale).toEqual('en')
    widgets.locale = 'de'
    expect(widgets.currentLocale).toEqual('de')
    expect(widgets.api.locale).toEqual('de')
  })

  test('cannot initialize the package in spanish or change it to spanish', () => {
    expect(() => new GreensparkWidgets({ apiKey: API_KEY, locale: 'es' as 'en' })).toThrow()
    const widgets = new GreensparkWidgets({ apiKey: API_KEY, locale: 'en' })
    expect(widgets.currentLocale).toEqual('en')
    expect(() => (widgets.locale = 'es' as 'de')).toThrow()
  })

  test('can create individual widget instances', () => {
    const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
    expect(typeof widgets.cart).toEqual('function')
    const cart = widgets.cart({ color: 'beige', order: EMPTY_ORDER })
    expect(cart instanceof CartWidget).toBe(true)

    const cartOldest = widgets.cart({ color: 'green', order: EMPTY_ORDER })
    const cartOld = widgets.cart({ color: 'blue', order: BASIC_ORDER })
    const cartNew = widgets.cart({ color: 'black', order: BASIC_ORDER })
    expect(cartOldest).not.toBe(cartOld)
    expect(cartOld).not.toBe(cartNew)
    expect(cartOldest).not.toBe(cartNew)
  })
})
