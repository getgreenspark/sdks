import axios from 'axios'

import GreensparkWidgets from '@/index'
import { PerOrderWidget } from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import { createContainer } from '@tests/utilities/dom'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string

let widgets: GreensparkWidgets

describe('Per order Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
  })

  test('can render a per order widget', async () => {
    expect(typeof widgets.perOrder).toEqual('function')
    const containerSelector = createContainer()
    const perOrder = widgets.perOrder({
      color: 'beige',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    expect(perOrder instanceof PerOrderWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await perOrder.render()
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)
  })

  test('can render a per order widget to a string', async () => {
    expect(typeof widgets.perOrder).toEqual('function')
    const containerSelector = createContainer()
    const perOrder = widgets.perOrder({
      color: 'beige',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await perOrder.renderToString()).toEqual(mockHtml)
  })

  test('can render a per order widget to an HTML Node', async () => {
    expect(typeof widgets.perOrder).toEqual('function')
    const containerSelector = createContainer()
    const perOrder = widgets.perOrder({
      color: 'beige',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await perOrder.renderToNode()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed or an invalid currency code', async () => {
    expect(typeof widgets.perOrder).toEqual('function')
    const containerSelector = createContainer()
    const perOrder = widgets.perOrder({
      color: 'yellow' as 'beige',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'

    expect(perOrder.render).rejects.toThrow()
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await perOrder.render({ color: 'beige' })
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)

    expect(() => perOrder.render({ color: '3' as 'black' })).rejects.toThrow()
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await perOrder.render({ color: 'beige' })
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)

    expect(() =>
      perOrder.render({ color: 'black', currency: 3 as unknown as string }),
    ).rejects.toThrow()
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await perOrder.render({ color: 'beige', currency: 'USD' })
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)
  })
})