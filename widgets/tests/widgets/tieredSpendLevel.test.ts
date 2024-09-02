import axios from 'axios'

import GreensparkWidgets from '@/index'
import { TieredSpendLevelWidget } from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import { createContainer } from '@tests/utilities/dom'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string

let widgets: GreensparkWidgets

describe('Tiered spend level Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
  })

  test('can render a tiered spend level widget', async () => {
    expect(typeof widgets.tieredSpendLevel).toEqual('function')
    const containerSelector = createContainer()
    const tieredSpendLevel = widgets.tieredSpendLevel({
      color: 'black',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    expect(tieredSpendLevel instanceof TieredSpendLevelWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await tieredSpendLevel.render()
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })

  test('can render a tiered spend level widget to a string', async () => {
    expect(typeof widgets.tieredSpendLevel).toEqual('function')
    const containerSelector = createContainer()
    const tieredSpendLevel = widgets.tieredSpendLevel({
      color: 'black',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await tieredSpendLevel.renderToString()).toEqual(mockHtml)
  })

  test('can render a tiered spend level widget to an HTML Node', async () => {
    expect(typeof widgets.tieredSpendLevel).toEqual('function')
    const containerSelector = createContainer()
    const tieredSpendLevel = widgets.tieredSpendLevel({
      color: 'black',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await tieredSpendLevel.renderToElement()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed', async () => {
    expect(typeof widgets.tieredSpendLevel).toEqual('function')
    const containerSelector = createContainer()
    const tieredSpendLevel = widgets.tieredSpendLevel({
      color: 'yellow' as 'beige',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(tieredSpendLevel.render).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await tieredSpendLevel.render({ color: 'beige' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)

    expect(() => tieredSpendLevel.render({ color: '3' as 'black' })).rejects.toThrow()
    expect(() =>
      tieredSpendLevel.render({ color: 'white', currency: 3 as unknown as string }),
    ).rejects.toThrow()
    expect(() =>
      tieredSpendLevel.render({ color: 'white', currency: null as unknown as string }),
    ).rejects.toThrow()
    expect(() =>
      tieredSpendLevel.render({ color: 'white', currency: undefined as unknown as string }),
    ).rejects.toThrow()
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await tieredSpendLevel.render({ color: 'beige', currency: 'EUR' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })
})
