import axios from 'axios'

import GreensparkWidgets from '@/index'
import { TopStatsWidget } from '@/widgets'

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

describe('Top Stats Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
  })

  test('can render a top stats widget', async () => {
    expect(typeof widgets.topStats).toEqual('function')
    const containerSelector = createContainer()
    const topStats = widgets.topStats({
      color: 'beige',
      containerSelector: containerSelector,
    })

    expect(topStats instanceof TopStatsWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await topStats.render()
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)
  })

  test('can render a top stats widget to a string', async () => {
    expect(typeof widgets.topStats).toEqual('function')
    const containerSelector = createContainer()
    const topStats = widgets.topStats({
      color: 'beige',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await topStats.renderToString()).toEqual(mockHtml)
  })

  test('can render a top stats widget to an HTML Node', async () => {
    expect(typeof widgets.topStats).toEqual('function')
    const containerSelector = createContainer()
    const topStats = widgets.topStats({
      color: 'beige',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await topStats.renderToNode()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed', async () => {
    expect(typeof widgets.topStats).toEqual('function')
    const containerSelector = createContainer()
    const topStats = widgets.topStats({
      color: 'yellow' as 'beige',
      containerSelector: containerSelector,
    })

    expect(topStats instanceof TopStatsWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(topStats.render).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await topStats.render({ color: 'beige' })
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)

    expect(() => topStats.render({ color: '3' as 'black' })).rejects.toThrow()
  })
})
