import axios from 'axios'

import GreensparkWidgets from '@/index'
import { CartWidget } from '@/widgets'

import apiFixtures from '@fixtures/api.json'
import cartFixtures from '@fixtures/cart.json'

import type { StoreOrder } from '@/interfaces'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string
const EMPTY_CART = cartFixtures.empty as StoreOrder

const createContainer = (): string => {
  const id = 'test-widget-container'
  const selector = `#${id}`

  const container = document.querySelector(selector) ?? document.createElement('div')
  container.innerHTML = ''
  container.id = id
  document.body.appendChild(container)
  return selector
}

describe('Widgets', () => {
  describe('Cart Widget', () => {
    test('can create an empty cart widget', async () => {
      const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
      expect(typeof widgets.cart).toEqual('function')
      const containerSelector = createContainer()
      const cart = widgets.cart({
        color: 'beige',
        order: EMPTY_CART,
        containerSelector: containerSelector,
      })

      expect(cart instanceof CartWidget).toBe(true)

      const mockString = 'some-html'
      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      expect(await cart.renderToString()).toEqual(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: 'some-html' })
      const renderNode = await cart.renderToNode()
      expect(renderNode.textContent).toBe(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: 'some-html' })
      await cart.render()
      expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockString)
    })
  })
})
