import axios from 'axios'

import GreensparkWidgets from '@/index'
import { TopStatsWidget } from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import { createContainer } from '@tests/utilities/dom'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const INTEGRATION_SLUG = apiFixtures.default.integrationSlug as string

let widgets: GreensparkWidgets

describe('Top Stats Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, integrationSlug: INTEGRATION_SLUG })
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
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
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
    const renderNode = await topStats.renderToElement()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed', async () => {
    expect(typeof widgets.topStats).toEqual('function')
    const containerSelector = createContainer()
    const topStats = widgets.topStats({
      color: 'yellow' as 'beige',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    expect(topStats.render).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await topStats.render({ color: 'beige' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)

    expect(() => topStats.render({ color: '3' as 'black' })).rejects.toThrow()
  })
})
