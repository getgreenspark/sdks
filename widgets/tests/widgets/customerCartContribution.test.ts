import axios from 'axios'

import GreensparkWidgets from '@/index'
import { widgetHtmlCache } from '@/utils/cache'

import apiFixtures from '@tests/fixtures/api.json'
import orderFixtures from '@tests/fixtures/order.json'
import { createContainer } from '@tests/utilities/dom'

import type { ProjectChoiceStorage, StoreOrder } from '@/interfaces'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const INTEGRATION_SLUG = apiFixtures.default.integrationSlug as string
const BASIC_ORDER = orderFixtures.basic as StoreOrder

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

const checkedProjectId = (containerSelector: string): string | undefined =>
  document.querySelector<HTMLInputElement>(`${containerSelector} input:checked`)?.value

const postedProjectIds = (): Array<string | undefined> =>
  axiosMock.post.mock.calls.map(
    ([, body]) => (body as { order: StoreOrder }).order.projectChoiceProjectId,
  )

const createWidget = (
  storage: ProjectChoiceStorage,
  order: StoreOrder = BASIC_ORDER,
  onRedraw?: () => void,
) => {
  const containerSelector = createContainer()
  const widget = widgets.customerCartContribution({
    color: 'beige',
    order,
    containerSelector,
    useShadowDom: false,
    projectChoice: { storage, onRedraw },
  })
  return { widget, containerSelector }
}

let widgets: GreensparkWidgets
describe('Customer Cart Contribution Widget project choice', () => {
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

  test('does not write when the shown selection matches the stored choice', async () => {
    const { storage } = createStorage(PLASTIC)
    const { widget } = createWidget(storage, { ...BASIC_ORDER, projectChoiceProjectId: PLASTIC })

    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(PLASTIC) })
    await widget.render()
    await settle()

    expect(storage.write).not.toHaveBeenCalled()
  })

  test('records the same shown selection once across renders', async () => {
    const { storage } = createStorage()
    const { widget } = createWidget(storage)

    axiosMock.post.mockResolvedValue({ data: choiceHtml(TREES) })
    await widget.render()
    await settle()
    // The platform renders again before its order carries the recorded choice.
    await widget.render({ order: { ...BASIC_ORDER, totalPrice: 11 } })
    await settle()

    expect(storage.read).toHaveBeenCalledTimes(1)
    expect(storage.write).toHaveBeenCalledTimes(1)
  })

  test('writes a shopper pick and redraws with it', async () => {
    const { storage, stored } = createStorage(TREES)
    const onRedraw = jest.fn()
    const { widget, containerSelector } = createWidget(
      storage,
      { ...BASIC_ORDER, projectChoiceProjectId: TREES },
      onRedraw,
    )

    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await widget.render()
    expect(onRedraw).not.toHaveBeenCalled()
    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(PLASTIC) })
    pick(containerSelector, PLASTIC)
    await settle()

    expect(stored()).toBe(PLASTIC)
    expect(postedProjectIds()).toEqual([TREES, PLASTIC])
    expect(document.querySelector(`${containerSelector} .figures`)?.textContent).toBe(PLASTIC)
    expect(onRedraw).toHaveBeenCalledTimes(1)
  })

  test('writes a pick once when two widgets render into the same container', async () => {
    const { storage } = createStorage(TREES)
    const order = { ...BASIC_ORDER, projectChoiceProjectId: TREES }
    const { widget: first, containerSelector } = createWidget(storage, order)
    const second = widgets.customerCartContribution({
      color: 'beige',
      order,
      containerSelector,
      useShadowDom: false,
      projectChoice: { storage },
    })

    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await first.render()
    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await second.render({ order: { ...order, totalPrice: 11 } })
    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(PLASTIC) })
    pick(containerSelector, PLASTIC)
    await settle()

    expect(storage.write).toHaveBeenCalledTimes(1)
    expect(storage.write).toHaveBeenCalledWith(PLASTIC)
    // Only the widget that rendered last redraws, with its own order.
    expect(axiosMock.post).toHaveBeenCalledTimes(3)
    expect((axiosMock.post.mock.calls[2][1] as { order: StoreOrder }).order.totalPrice).toBe(11)
  })

  test('ends on the latest pick and redraws only for it', async () => {
    const { storage, stored } = createStorage(TREES)
    const firstWrite = deferred<void>()
    storage.write.mockImplementationOnce(async () => firstWrite.promise)
    const { widget, containerSelector } = createWidget(storage, {
      ...BASIC_ORDER,
      projectChoiceProjectId: TREES,
    })

    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await widget.render()
    pick(containerSelector, PLASTIC)
    await settle()
    pick(containerSelector, TREES)
    firstWrite.resolve()
    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await settle()

    // The first write never landed in storage, so the cart still holds TREES and needs no write.
    expect(storage.write).toHaveBeenCalledTimes(1)
    expect(stored()).toBe(TREES)
    // No redraw for the superseded pick; the TREES redraw is served from the HTML cache.
    expect(postedProjectIds()).toEqual([TREES])
    expect(checkedProjectId(containerSelector)).toBe(TREES)
  })

  test('retries a failed write once', async () => {
    const { storage, stored } = createStorage(TREES)
    storage.write.mockRejectedValueOnce(new Error('network'))
    const { widget, containerSelector } = createWidget(storage, {
      ...BASIC_ORDER,
      projectChoiceProjectId: TREES,
    })

    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await widget.render()
    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(PLASTIC) })
    pick(containerSelector, PLASTIC)
    await settle()

    expect(storage.write).toHaveBeenCalledTimes(2)
    expect(stored()).toBe(PLASTIC)
  })

  test('keeps the API selection checked when recording it keeps failing', async () => {
    const { storage } = createStorage()
    storage.write.mockRejectedValue(new Error('network'))
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const { widget, containerSelector } = createWidget(storage)

    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await widget.render()
    await settle()

    expect(storage.write).toHaveBeenCalledTimes(2)
    expect(checkedProjectId(containerSelector)).toBe(TREES)
  })

  test('returns to the API selection and logs when a pick keeps failing', async () => {
    const { storage } = createStorage(TREES)
    storage.write.mockRejectedValue(new Error('network'))
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const { widget, containerSelector } = createWidget(storage, {
      ...BASIC_ORDER,
      projectChoiceProjectId: TREES,
    })

    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await widget.render()
    pick(containerSelector, PLASTIC)
    await settle()

    expect(storage.write).toHaveBeenCalledTimes(2)
    expect(checkedProjectId(containerSelector)).toBe(TREES)
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
    expect(consoleError).toHaveBeenCalled()
  })

  test('does not record the shown selection over a pending pick', async () => {
    const { storage } = createStorage(TREES)
    const pickWrite = deferred<void>()
    storage.write.mockImplementationOnce(async () => pickWrite.promise)
    const { widget, containerSelector } = createWidget(storage, {
      ...BASIC_ORDER,
      projectChoiceProjectId: TREES,
    })

    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await widget.render()
    pick(containerSelector, PLASTIC)
    await settle()
    // A platform render while the pick is in flight still carries the old stored choice.
    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(TREES) })
    await widget.render({ order: { ...BASIC_ORDER, totalPrice: 11 } })
    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(PLASTIC) })
    pickWrite.resolve()
    await settle()

    expect(storage.write).toHaveBeenCalledTimes(1)
    expect(storage.write).toHaveBeenCalledWith(PLASTIC)
    expect(checkedProjectId(containerSelector)).toBe(PLASTIC)
  })

  test('drops a render response that a newer render overtook', async () => {
    const { storage } = createStorage(TREES)
    const { widget, containerSelector } = createWidget(storage, {
      ...BASIC_ORDER,
      projectChoiceProjectId: TREES,
    })
    const slow = deferred<{ data: string }>()

    axiosMock.post.mockReturnValueOnce(slow.promise)
    const first = widget.render()
    axiosMock.post.mockResolvedValueOnce({ data: choiceHtml(PLASTIC) })
    await widget.render({ order: { ...BASIC_ORDER, totalPrice: 11, projectChoiceProjectId: PLASTIC } })
    slow.resolve({ data: choiceHtml(TREES) })
    await first

    expect(document.querySelector(`${containerSelector} .figures`)?.textContent).toBe(PLASTIC)
  })

  test('rejects storage without read and write', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() =>
      widgets.customerCartContribution({
        color: 'beige',
        order: BASIC_ORDER,
        containerSelector: createContainer(),
        projectChoice: { storage: {} as ProjectChoiceStorage },
      }),
    ).toThrow('"projectChoice.storage" must provide "read" and "write" functions')
  })

  test('rejects a non-function onRedraw', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const { storage } = createStorage()
    expect(() =>
      widgets.customerCartContribution({
        color: 'beige',
        order: BASIC_ORDER,
        containerSelector: createContainer(),
        projectChoice: { storage, onRedraw: 'move' as unknown as () => void },
      }),
    ).toThrow('"projectChoice.onRedraw" must be a function')
  })

  test('rejects a non-string stored choice on the order', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const widget = widgets.customerCartContribution({
      color: 'beige',
      order: { ...BASIC_ORDER, projectChoiceProjectId: 42 as unknown as string },
      containerSelector: createContainer(),
    })

    await expect(widget.render()).rejects.toThrow('"order.projectChoiceProjectId" must be a string')
  })
})
