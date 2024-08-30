import axios from 'axios'

import GreensparkWidgets from '@/index'
import { SpendLevelWidget } from '@/widgets'

import apiFixtures from '@tests/fixtures/api.json'
import { createContainer } from '@tests/utilities/dom'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string

let widgets: GreensparkWidgets

describe('Spend level Widget', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
  })

  test('can render a spend level widget', async () => {
    expect(typeof widgets.spendLevel).toEqual('function')
    const containerSelector = createContainer()
    const spendLevel = widgets.spendLevel({
      color: 'black',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    expect(spendLevel instanceof SpendLevelWidget).toBe(true)

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await spendLevel.render()
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })

  test('can render a spend level widget to a string', async () => {
    expect(typeof widgets.spendLevel).toEqual('function')
    const containerSelector = createContainer()
    const spendLevel = widgets.spendLevel({
      color: 'black',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    expect(await spendLevel.renderToString()).toEqual(mockHtml)
  })

  test('can render a spend level widget to an HTML Node', async () => {
    expect(typeof widgets.spendLevel).toEqual('function')
    const containerSelector = createContainer()
    const spendLevel = widgets.spendLevel({
      color: 'black',
      currency: 'USD',
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    const renderNode = await spendLevel.renderToElement()
    expect(renderNode.textContent).toBe('Hi there!')
  })

  test('cannot render a color that is not allowed or an invalid currency value', async () => {
    expect(typeof widgets.spendLevel).toEqual('function')
    const containerSelector = createContainer()
    const spendLevel = widgets.spendLevel({
      color: 'yellow' as 'beige',
      currency: 'USD',
      withPopup: false,
      containerSelector: containerSelector,
    })

    const mockHtml = '<p class="hi"><strong>Hi</strong> there!</p>'
    expect(spendLevel.render).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await spendLevel.render({ color: 'beige' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)

    expect(() => spendLevel.render({ color: '3' as 'black' })).rejects.toThrow()
    expect(() =>
      spendLevel.render({ color: 'black', currency: 3 as unknown as string }),
    ).rejects.toThrow()
    expect(() =>
      spendLevel.render({ color: 'black', currency: null as unknown as string }),
    ).rejects.toThrow()
    expect(() =>
      spendLevel.render({ color: 'black', currency: undefined as unknown as string }),
    ).rejects.toThrow()

    axiosMock.post.mockResolvedValueOnce({ data: mockHtml })
    await spendLevel.render({ color: 'white', currency: 'USD' })
    expect(document.querySelector(containerSelector)?.shadowRoot?.innerHTML).toEqual(mockHtml)
  })
})
