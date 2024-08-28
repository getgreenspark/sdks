import axios from 'axios'

import GreensparkWidgets from '@/index'
import { ByPercentageWidget } from '@/widgets'

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
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)
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
    const renderNode = await byPercentage.renderToNode()
    expect(renderNode.textContent).toBe('Hi there!')
  })
})
