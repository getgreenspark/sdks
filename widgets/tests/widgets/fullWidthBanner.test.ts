import axios from 'axios'

import GreensparkWidgets from '@/index'
import { FullWidthBannerWidget } from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import { createContainer } from '@tests/utilities/dom'

import type { AVAILABLE_STATISTIC_TYPES } from '@/constants'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const INTEGRATION_SLUG = apiFixtures.default.integrationSlug as string

let widgets: GreensparkWidgets

describe('Full Width Banner Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, integrationSlug: INTEGRATION_SLUG })
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
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
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
    const renderNode = await fullWidthBanner.renderToElement()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render with wrong options or image url', async () => {
    expect(typeof widgets.fullWidthBanner).toEqual('function')
    const containerSelector = createContainer()
    const fullWidthBanner = widgets.fullWidthBanner({
      options: [
        'monthsEarthPositive',
        'trees',
        'someInvalidOption' as unknown as (typeof AVAILABLE_STATISTIC_TYPES)[number],
      ],
      containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(fullWidthBanner.render).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await fullWidthBanner.render({
      options: ['monthsEarthPositive', 'trees'],
    })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
    expect(() => fullWidthBanner.render({ options: [] })).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await fullWidthBanner.render({
      options: ['monthsEarthPositive', 'trees'],
      imageUrl: 'https://some.url.com/to/image.png',
    })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
    expect(() =>
      fullWidthBanner.render({
        options: ['monthsEarthPositive', 'trees'],
        imageUrl: 3 as unknown as string,
      }),
    ).rejects.toThrow()
  })
})
