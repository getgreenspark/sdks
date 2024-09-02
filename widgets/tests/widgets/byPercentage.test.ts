import axios from 'axios'

import GreensparkWidgets from '@/index'
import { ByPercentageWidget } from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import { createContainer } from '@tests/utilities/dom'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string

let widgets: GreensparkWidgets

describe('By Percentage Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
  })

  test('can render a by percentage widget', async () => {
    expect(typeof widgets.byPercentage).toEqual('function')
    const containerSelector = createContainer()
    const byPercentage = widgets.byPercentage({
      color: 'beige',
      containerSelector: containerSelector,
    })

    expect(byPercentage instanceof ByPercentageWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await byPercentage.render()
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })

  test('can render a by percentage widget to a string', async () => {
    expect(typeof widgets.byPercentage).toEqual('function')
    const containerSelector = createContainer()
    const byPercentage = widgets.byPercentage({
      color: 'beige',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await byPercentage.renderToString()).toEqual(mockHtml)
  })

  test('can render a by percentage widget to an HTML Node', async () => {
    expect(typeof widgets.byPercentage).toEqual('function')
    const containerSelector = createContainer()
    const byPercentage = widgets.byPercentage({
      color: 'beige',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await byPercentage.renderToElement()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed', async () => {
    expect(typeof widgets.byPercentage).toEqual('function')
    const containerSelector = createContainer()
    const byPercentage = widgets.byPercentage({
      color: 'yellow' as 'beige',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    expect(byPercentage.render).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await byPercentage.render({ color: 'beige' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)

    expect(() => byPercentage.render({ color: '3' as 'black' })).rejects.toThrow()
  })
})
