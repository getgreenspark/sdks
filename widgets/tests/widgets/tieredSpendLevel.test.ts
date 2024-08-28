import axios from 'axios'

import GreensparkWidgets from '@/index'
import { TieredSpendLevelWidget } from '@/widgets'

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
    expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockHtml)
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
    const renderNode = await tieredSpendLevel.renderToNode()
    expect(renderNode.textContent).toBe('Hi there!')
  })
})
