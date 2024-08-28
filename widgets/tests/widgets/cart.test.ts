import axios from 'axios'

import GreensparkWidgets from '@/index'
import { CartWidget } from '@/widgets'

import apiFixtures from '@fixtures/api.json'
import orderFixtures from '@fixtures/order.json'

import type { StoreOrder } from '@/interfaces'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string
const EMPTY_CART = orderFixtures.empty as StoreOrder

const createContainer = (): string => {
  const id = 'test-widget-container'
  const selector = `#${id}`

  const container = document.querySelector(selector) ?? document.createElement('div')
  container.innerHTML = ''
  container.id = id
  document.body.appendChild(container)
  return selector
}

let widgets: GreensparkWidgets
describe('Cart Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
  })

  test('can render a cart widget', async () => {
    expect(typeof widgets.cart).toEqual('function')
    const containerSelector = createContainer()
    const cart = widgets.cart({
      color: 'beige',
      order: EMPTY_CART,
      containerSelector: containerSelector,
    })

    expect(cart instanceof CartWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await cart.render()
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)
  })

  test('can render a cart widget to a string', async () => {
    expect(typeof widgets.cart).toEqual('function')
    const containerSelector = createContainer()
    const cart = widgets.cart({
      color: 'beige',
      order: EMPTY_CART,
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
      order: EMPTY_CART,
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await cart.renderToNode()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed', async () => {
    expect(typeof widgets.cart).toEqual('function')
    const containerSelector = createContainer()
    const cart = widgets.cart({
      color: 'yellow' as 'beige',
      order: EMPTY_CART,
      containerSelector: containerSelector,
    })

    expect(cart instanceof CartWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(cart.render).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await cart.render({ color: 'beige' })
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)

    expect(() => cart.render({ color: '3' as 'black' })).rejects.toThrow()
  })
})
