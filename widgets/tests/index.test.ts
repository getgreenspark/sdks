import axios from 'axios'
import { DEFAULT_LOCALE } from '@/constants'
import GreensparkWidgets from '@/index'
import { CartWidget } from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import orderFixture from '@tests/fixtures/order.json'

import type { StoreOrder } from '@/interfaces'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const INTEGRATION_SLUG = apiFixtures.default.integrationSlug as string
const BASIC_ORDER = orderFixture.basic as StoreOrder

describe('GreensparkWidgets', () => {
  test('can initialize the package through import', () => {
    const widgets = new GreensparkWidgets({ apiKey: API_KEY })
    expect(widgets instanceof GreensparkWidgets).toBe(true)
    expect(widgets.apiKey).toEqual(API_KEY)
    expect(widgets.currentLocale).toEqual(DEFAULT_LOCALE)
    expect(widgets.integrationSlug).toBeUndefined()
  })

  test('can initialize the package through the window object', () => {
    const widgets = new window.GreensparkWidgets({ apiKey: API_KEY })
    expect(widgets instanceof GreensparkWidgets).toBe(true)
    expect(widgets.apiKey).toEqual(API_KEY)
    expect(widgets.currentLocale).toEqual(DEFAULT_LOCALE)
    expect(widgets.integrationSlug).toBeUndefined()
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

  test('can create individual widget instances', async () => {
    const widgets = new GreensparkWidgets({ apiKey: API_KEY, integrationSlug: INTEGRATION_SLUG })
    expect(typeof widgets.cart).toEqual('function')
    const cart = widgets.cart({ color: 'beige', order: BASIC_ORDER })
    expect(cart instanceof CartWidget).toBe(true)

    const cartOldest = widgets.cart({ color: 'green', order: BASIC_ORDER })
    const cartOld = widgets.cart({ color: 'blue', order: BASIC_ORDER })
    const cartNew = widgets.cart({ color: 'black', order: BASIC_ORDER })
    expect(cartOldest).not.toBe(cartOld)
    expect(cartOld).not.toBe(cartNew)
    expect(cartOldest).not.toBe(cartNew)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await cartNew.renderToString()).toBe(mockHtml)
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await cartOld.renderToString()).toBe(mockHtml)
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await cartOldest.renderToString()).toBe(mockHtml)
  })
})
