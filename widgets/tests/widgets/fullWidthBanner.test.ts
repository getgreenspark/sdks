import axios from 'axios'

import GreensparkWidgets from '@/index'
import { FullWidthBannerWidget } from '@/widgets'

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

describe('Full Width Banner Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
  })

  test('can render a full width banner widget', async () => {
    expect(typeof widgets.fullWidthBanner).toEqual('function')
    const containerSelector = createContainer()
    const fullWidthBanner = widgets.fullWidthBanner({
      options: [
        'monthsEarthPositive',
        'trees',
        'plastic',
        'carbon',
        'straws',
        'miles',
        'footballPitches',
      ],
      containerSelector,
    })

    expect(fullWidthBanner instanceof FullWidthBannerWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await fullWidthBanner.render()
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)
  })

  test('can render a full width banner widget to a string', async () => {
    expect(typeof widgets.fullWidthBanner).toEqual('function')
    const containerSelector = createContainer()
    const fullWidthBanner = widgets.fullWidthBanner({
      options: [
        'monthsEarthPositive',
        'trees',
        'plastic',
        'carbon',
        'straws',
        'miles',
        'footballPitches',
      ],
      containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await fullWidthBanner.renderToString()).toEqual(mockHtml)
  })

  test('can render a full width banner widget to an HTML Node', async () => {
    expect(typeof widgets.fullWidthBanner).toEqual('function')
    const containerSelector = createContainer()
    const fullWidthBanner = widgets.fullWidthBanner({
      options: [
        'monthsEarthPositive',
        'trees',
        'plastic',
        'carbon',
        'straws',
        'miles',
        'footballPitches',
      ],
      containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await fullWidthBanner.renderToNode()
    expect(renderNode.textContent).toBe('Hi there!')
  })
})
