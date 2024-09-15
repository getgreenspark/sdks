import axios from 'axios'

import GreensparkWidgets from '@/index'
import { CartWidget } from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import orderFixtures from '@tests/fixtures/order.json'
import { createContainer } from '@tests/utilities/dom'

import type { StoreOrder } from '@/interfaces'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const INTEGRATION_SLUG = apiFixtures.default.integrationSlug as string
const EMPTY_ORDER = orderFixtures.empty as StoreOrder
const BASIC_ORDER = orderFixtures.basic as StoreOrder
const ORDER_WITH_INVALID_PRICE = orderFixtures.invalidPrice as StoreOrder
const ORDER_WITH_INVALID_PRODUCTS = orderFixtures.invalidProducts as unknown as StoreOrder
const ORDER_WITH_INVALID_QUANTITIES = orderFixtures.invalidQuantities as StoreOrder

let widgets: GreensparkWidgets
describe('Cart Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, integrationSlug: INTEGRATION_SLUG })
  })

  test('can render a cart widget', async () => {
    expect(typeof widgets.cart).toEqual('function')
    const containerSelector = createContainer()
    const cart = widgets.cart({
      color: 'beige',
      order: EMPTY_ORDER,
      containerSelector: containerSelector,
    })

    expect(cart instanceof CartWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await cart.render()
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })

  test('can render a cart widget to a string', async () => {
    expect(typeof widgets.cart).toEqual('function')
    const containerSelector = createContainer()
    const cart = widgets.cart({
      color: 'beige',
      order: BASIC_ORDER,
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there cart!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await cart.renderToString()).toEqual(mockHtml)
  })

  test('can render a cart widget to an HTML Node', async () => {
    expect(typeof widgets.cart).toEqual('function')
    const containerSelector = createContainer()
    const cart = widgets.cart({
      color: 'beige',
      order: BASIC_ORDER,
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await cart.renderToElement()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed', async () => {
    expect(typeof widgets.cart).toEqual('function')
    const containerSelector = createContainer()
    const cart = widgets.cart({
      color: 'yellow' as 'beige',
      order: BASIC_ORDER,
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(cart.render).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await cart.render({ color: 'beige' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)

    expect(() => cart.render({ color: '3' as 'black' })).rejects.toThrow()
  })

  test('cannot render an invalid order', async () => {
    expect(typeof widgets.cart).toEqual('function')
    const containerSelector = createContainer()
    const cart = widgets.cart({
      color: 'beige',
      order: ORDER_WITH_INVALID_PRICE,
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    expect(cart.render).rejects.toThrow()
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await cart.render({ order: BASIC_ORDER })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)

    expect(() => cart.render({ order: ORDER_WITH_INVALID_PRODUCTS })).rejects.toThrow()
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await cart.render({ order: BASIC_ORDER })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)

    expect(() => cart.render({ order: ORDER_WITH_INVALID_QUANTITIES })).rejects.toThrow()
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await cart.render({ order: BASIC_ORDER })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })
})
