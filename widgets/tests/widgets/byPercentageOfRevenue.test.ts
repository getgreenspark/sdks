import axios from 'axios'

import GreensparkWidgets from '@/index'
import {ByPercentageOfRevenueWidget} from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import { createContainer } from '@tests/utilities/dom'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const INTEGRATION_SLUG = apiFixtures.default.integrationSlug as string

let widgets: GreensparkWidgets

describe('By Percentage Of Revenue Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, integrationSlug: INTEGRATION_SLUG })
  })

  test('can render a by percentage widget', async () => {
    expect(typeof widgets.byPercentageOfRevenue).toEqual('function')
    const containerSelector = createContainer()
    const byPercentageOfRevenue = widgets.byPercentageOfRevenue({
      color: 'beige',
      containerSelector: containerSelector,
    })

    expect(byPercentageOfRevenue instanceof ByPercentageOfRevenueWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await byPercentageOfRevenue.render()
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })

  test('can render a by percentage widget to a string', async () => {
    expect(typeof widgets.byPercentageOfRevenue).toEqual('function')
    const containerSelector = createContainer()
    const byPercentageOfRevenue = widgets.byPercentageOfRevenue({
      color: 'beige',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await byPercentageOfRevenue.renderToString()).toEqual(mockHtml)
  })

  test('can render a by percentage widget to an HTML Node', async () => {
    expect(typeof widgets.byPercentageOfRevenue).toEqual('function')
    const containerSelector = createContainer()
    const byPercentageOfRevenue = widgets.byPercentageOfRevenue({
      color: 'beige',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await byPercentageOfRevenue.renderToElement()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed', async () => {
    expect(typeof widgets.byPercentageOfRevenue).toEqual('function')
    const containerSelector = createContainer()
    const byPercentageOfRevenue = widgets.byPercentageOfRevenue({
      color: 'yellow' as 'beige',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    expect(byPercentageOfRevenue.render).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await byPercentageOfRevenue.render({ color: 'beige' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)

    expect(() => byPercentageOfRevenue.render({ color: '3' as 'black' })).rejects.toThrow()
  })
})
