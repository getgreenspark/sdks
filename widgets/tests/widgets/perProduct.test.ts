import axios from 'axios'

import GreensparkWidgets from '@/index'
import { PerProductWidget } from '@/widgets'

import apiFixtures from '@fixtures/api.json'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string

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

describe('Per product level Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
  })

  test('can render a per product widget', async () => {
    expect(typeof widgets.perProduct).toEqual('function')
    const containerSelector = createContainer()
    const perProduct = widgets.perProduct({
      color: 'beige',
      productId: 'id-for-some-product',
      containerSelector: containerSelector,
    })

    expect(perProduct instanceof PerProductWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await perProduct.render()
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)
  })

  test('can render a per product widget to a string', async () => {
    expect(typeof widgets.perProduct).toEqual('function')
    const containerSelector = createContainer()
    const perProduct = widgets.perProduct({
      color: 'beige',
      productId: 'id-for-some-product',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await perProduct.renderToString()).toEqual(mockHtml)
  })

  test('can render a per product widget to an HTML Node', async () => {
    expect(typeof widgets.perProduct).toEqual('function')
    const containerSelector = createContainer()
    const perProduct = widgets.perProduct({
      color: 'beige',
      productId: 'id-for-some-product',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await perProduct.renderToNode()
    expect(renderNode.textContent).toBe('Hi there!')
  })
})
