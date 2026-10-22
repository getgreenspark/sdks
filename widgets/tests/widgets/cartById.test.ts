import axios from 'axios'

import GreensparkWidgets from '@/index'
import { widgetHtmlCache } from '@/utils/cache'

import apiFixtures from '@tests/fixtures/api.json'
import orderFixtures from '@tests/fixtures/order.json'
import { createContainer } from '@tests/utilities/dom'

import type { CustomerChoiceStorage, StoreOrder } from '@/interfaces'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const INTEGRATION_SLUG = apiFixtures.default.integrationSlug as string
const BASIC_ORDER = orderFixtures.basic as StoreOrder
const WIDGET_ID = 'widget-123'

const TREES = 'project-trees'
const PLASTIC = 'project-plastic'

// Mirrors the radios the API renders: one input per option, the API's selection checked.
const choiceHtml = (selectedProjectId: string): string =>
  [TREES, PLASTIC]
    .map(
      (projectId) =>
        `<input type="radio" name="greenspark-project-choice" value="${projectId}" data-greenspark-project-choice-input${projectId === selectedProjectId ? ' checked' : ''} />`,
    )
    .join('') + `<p class="figures">${selectedProjectId}</p>`

const createStorage = (initial = '') => {
  let stored = initial
  const storage = {
    read: jest.fn(async () => stored),
    write: jest.fn(async (projectId: string) => {
      stored = projectId
    }),
  }
  return { storage, stored: () => stored }
}

const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const settle = async (): Promise<void> => {
  for (let i = 0; i < 10; i++) await new Promise((resolve) => setTimeout(resolve, 0))
}

const pick = (containerSelector: string, projectId: string): void => {
  const input = document.querySelector<HTMLInputElement>(
    `${containerSelector} input[value="${projectId}"]`,
  )
  if (!input) throw new Error(`No radio for ${projectId}`)
  input.checked = true
  input.dispatchEvent(new Event('change', { bubbles: true }))
}

const postedBodies = (): Array<Record<string, unknown>> =>
  axiosMock.post.mock.calls.map(([, body]) => body as Record<string, unknown>)

const createWidget = (
  storage: CustomerChoiceStorage,
  order: StoreOrder = BASIC_ORDER,
  onRedraw?: () => void,
) => {
  const containerSelector = createContainer()
  const widget = widgets.cartById({
    widgetId: WIDGET_ID,
    order,
    containerSelector,
    useShadowDom: false,
    version: 'v2',
    customerChoice: { storage, onRedraw },
  })
  return { widget, containerSelector }
}

let widgets: GreensparkWidgets
describe('Cart widget by id project choice', () => {
  beforeAll(() => {
    widgets = new GreensparkWidgets({ apiKey: API_KEY, integrationSlug: INTEGRATION_SLUG })
  })

  beforeEach(() => {
    widgetHtmlCache.clear()
    axiosMock.post.mockReset()
  })

  test('records the shown selection when the cart has no stored choice', async () => {
    const { storage, stored } = createStorage()
    const { widget } = createWidget(storage)

    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await widget.render()
    await settle()

    expect(stored()).toBe(TREES)
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
  })

  test('writes a shopper pick and redraws with it, without sending storage to the API', async () => {
    const { storage, stored } = createStorage(TREES)
    const onRedraw = jest.fn()
    const { widget, containerSelector } = createWidget(
      storage,
      { ...BASIC_ORDER, customerChoiceProjectId: TREES },
      onRedraw,
    )

    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await widget.render()
    expect(onRedraw).not.toHaveBeenCalled()
    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(PLASTIC) })
    pick(containerSelector, PLASTIC)
    await settle()

    expect(stored()).toBe(PLASTIC)
    const bodies = postedBodies()
    expect(bodies).toHaveLength(2)
    expect(bodies[1]).not.toHaveProperty('customerChoice')
    expect((bodies[1].order as StoreOrder).customerChoiceProjectId).toBe(PLASTIC)
    expect(document.querySelector(`${containerSelector} .figures`)?.textContent).toBe(PLASTIC)
    expect(onRedraw).toHaveBeenCalledTimes(1)
  })

  test('drops a render response that a newer render overtook', async () => {
    const { storage } = createStorage(TREES)
    const { widget, containerSelector } = createWidget(storage, {
      ...BASIC_ORDER,
      customerChoiceProjectId: TREES,
    })
    const slow = deferred<{ data: string }>()

    axiosMock.post.mockReturnValueOnce(slow.promise)
    const first = widget.render()
    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(PLASTIC) })
    await widget.render({
      order: { ...BASIC_ORDER, totalPrice: 11, customerChoiceProjectId: PLASTIC },
    })
    slow.resolve({ data: choiceHtml(TREES) })
    await first

    expect(document.querySelector(`${containerSelector} .figures`)?.textContent).toBe(PLASTIC)
  })

  test('rejects storage without read and write', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() =>
      widgets.cartById({
        widgetId: WIDGET_ID,
        order: BASIC_ORDER,
        containerSelector: createContainer(),
        customerChoice: { storage: {} as CustomerChoiceStorage },
      }),
    ).toThrow('"customerChoice.storage" must provide "read" and "write" functions')
  })
})
