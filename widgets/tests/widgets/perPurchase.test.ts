import axios from 'axios'

import GreensparkWidgets from '@/index'
import { PerPurchaseWidget } from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import { createContainer } from '@tests/utilities/dom'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const INTEGRATION_SLUG = apiFixtures.default.integrationSlug as string

let widgets: GreensparkWidgets

describe('Per purchase Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, integrationSlug: INTEGRATION_SLUG })
  })

  test('can render a per purchase widget', async () => {
    expect(typeof widgets.perPurchase).toEqual('function')
    const containerSelector = createContainer()
    const perPurchase = widgets.perPurchase({
      color: 'beige',
      containerSelector: containerSelector,
      version: 'v2',
    })

    expect(perPurchase instanceof PerPurchaseWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await perPurchase.render()
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })

  test('can render a per purchase widget to a string', async () => {
    expect(typeof widgets.perPurchase).toEqual('function')
    const containerSelector = createContainer()
    const perPurchase = widgets.perPurchase({
      color: 'beige',
      containerSelector: containerSelector,
      version: 'v2',
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await perPurchase.renderToString()).toEqual(mockHtml)
  })

  test('can render a per purchase widget to an HTML Node', async () => {
    expect(typeof widgets.perPurchase).toEqual('function')
    const containerSelector = createContainer()
    const perPurchase = widgets.perPurchase({
      color: 'beige',
      containerSelector: containerSelector,
      version: 'v2',
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await perPurchase.renderToElement()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed', async () => {
    expect(typeof widgets.perPurchase).toEqual('function')
    const containerSelector = createContainer()
    const perPurchase = widgets.perPurchase({
      color: 'yellow' as 'beige',
      containerSelector: containerSelector,
      version: 'v2',
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'

    expect(perPurchase.render).rejects.toThrow()
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await perPurchase.render({ color: 'beige', version: 'v2' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)

    expect(() => perPurchase.render({ color: '3' as 'black', version: 'v2' })).rejects.toThrow()
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await perPurchase.render({ color: 'beige', version: 'v2' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })
})
