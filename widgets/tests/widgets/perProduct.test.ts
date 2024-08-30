import axios from 'axios'

import GreensparkWidgets from '@/index'
import { PerProductWidget } from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import { createContainer } from '@tests/utilities/dom'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string

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
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
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
    const renderNode = await perProduct.renderToElement()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed or an invalid product id', async () => {
    expect(typeof widgets.perProduct).toEqual('function')
    const containerSelector = createContainer()
    const perProduct = widgets.perProduct({
      color: 'yellow' as 'beige',
      productId: 'something-something',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    expect(perProduct.render).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await perProduct.render({ color: 'beige', productId: '123' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
    expect(() => perProduct.render({ color: '3' as 'black' })).rejects.toThrow()
    expect(() => perProduct.render({ productId: 123 as unknown as string })).rejects.toThrow()
    expect(() => perProduct.render({ productId: '' as unknown as string })).rejects.toThrow()
    expect(() => perProduct.render({ productId: undefined as unknown as string })).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await perProduct.render({ color: 'beige', productId: '123' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })
})
