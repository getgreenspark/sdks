import axios from 'axios'

import GreensparkWidgets from '@/index'
import {
  ByPercentageWidget,
  CartWidget,
  PerOrderWidget,
  PerProductWidget,
  SpendLevelWidget,
  TieredSpendLevelWidget,
  TopStatsWidget,
} from '@/widgets'

import apiFixtures from '@fixtures/api.json'
import orderFixtures from '@fixtures/order.json'

import type { StoreOrder } from '@/interfaces'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const SHOP_UNIQUE_NAME = apiFixtures.default.shopUniqueName as string
const EMPTY_CART = orderFixtures.empty as StoreOrder

const createContainer = (): string => {
  const id = 'test-widget-container'
  const selector = `#${id}`

  const container = document.querySelector(selector) ?? document.createElement('div')
  container.innerHTML = ''
  container.id = id
  document.body.appendChild(container)
  return selector
}

describe('Widgets', () => {
  describe('Cart Widget', () => {
    test('can create an empty cart widget', async () => {
      const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
      expect(typeof widgets.cart).toEqual('function')
      const containerSelector = createContainer()
      const cart = widgets.cart({
        color: 'beige',
        order: EMPTY_CART,
        containerSelector: containerSelector,
      })

      expect(cart instanceof CartWidget).toBe(true)

      const mockString = 'some-html'
      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      expect(await cart.renderToString()).toEqual(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      const renderNode = await cart.renderToNode()
      expect(renderNode.textContent).toBe(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      await cart.render()
      expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockString)
    })
  })

  describe('Spend Level Widget', () => {
    test('can create basic spend level widget', async () => {
      const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
      expect(typeof widgets.spendLevel).toEqual('function')
      const containerSelector = createContainer()
      const spendLevel = widgets.spendLevel({
        color: 'beige',
        currency: 'USD',
        containerSelector: containerSelector,
      })

      expect(spendLevel instanceof SpendLevelWidget).toBe(true)

      const mockString = 'some-spend-level-html'
      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      expect(await spendLevel.renderToString()).toEqual(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      const renderNode = await spendLevel.renderToNode()
      expect(renderNode.textContent).toBe(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      await spendLevel.render()
      expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockString)
    })
  })

  describe('Per Order Widget', () => {
    test('can create basic per order widget', async () => {
      const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
      expect(typeof widgets.perOrder).toEqual('function')
      const containerSelector = createContainer()
      const perOrder = widgets.perOrder({
        color: 'beige',
        currency: 'USD',
        containerSelector: containerSelector,
      })

      expect(perOrder instanceof PerOrderWidget).toBe(true)

      const mockString = 'per-order-level-html'
      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      expect(await perOrder.renderToString()).toEqual(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      const renderNode = await perOrder.renderToNode()
      expect(renderNode.textContent).toBe(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      await perOrder.render()
      expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockString)
    })
  })

  describe('By Percentage Widget', () => {
    test('can create by percentage widget', async () => {
      const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
      expect(typeof widgets.byPercentage).toEqual('function')
      const containerSelector = createContainer()
      const byPercentage = widgets.byPercentage({
        color: 'beige',
        containerSelector: containerSelector,
      })

      expect(byPercentage instanceof ByPercentageWidget).toBe(true)

      const mockString = 'some-percentage-html'
      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      expect(await byPercentage.renderToString()).toEqual(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      const renderNode = await byPercentage.renderToNode()
      expect(renderNode.textContent).toBe(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      await byPercentage.render()
      expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockString)
    })
  })

  describe('Tiered Spend Level Widget', () => {
    test('can create tiered spend level widget', async () => {
      const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
      expect(typeof widgets.tieredSpendLevel).toEqual('function')
      const containerSelector = createContainer()
      const tieredSpendLevel = widgets.tieredSpendLevel({
        color: 'beige',
        currency: 'USD',
        containerSelector: containerSelector,
      })

      expect(tieredSpendLevel instanceof TieredSpendLevelWidget).toBe(true)

      const mockString = 'some-tiered-level-html'
      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      expect(await tieredSpendLevel.renderToString()).toEqual(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      const renderNode = await tieredSpendLevel.renderToNode()
      expect(renderNode.textContent).toBe(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      await tieredSpendLevel.render()
      expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockString)
    })
  })

  describe('Per Product Widget', () => {
    test('can create per product widget', async () => {
      const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
      expect(typeof widgets.perProduct).toEqual('function')
      const containerSelector = createContainer()
      const perProduct = widgets.perProduct({
        color: 'beige',
        productId: 'id-for-some-product',
        containerSelector: containerSelector,
      })

      expect(perProduct instanceof PerProductWidget).toBe(true)

      const mockString = 'some-product-html'
      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      expect(await perProduct.renderToString()).toEqual(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      const renderNode = await perProduct.renderToNode()
      expect(renderNode.textContent).toBe(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      await perProduct.render()
      expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockString)
    })
  })

  describe('Top Stats Widget', () => {
    test('can create top stats widget', async () => {
      const widgets = new GreensparkWidgets({ apiKey: API_KEY, shopUniqueName: SHOP_UNIQUE_NAME })
      expect(typeof widgets.topStats).toEqual('function')
      const containerSelector = createContainer()
      const topStats = widgets.topStats({
        color: 'beige',
        containerSelector: containerSelector,
      })

      expect(topStats instanceof TopStatsWidget).toBe(true)

      const mockString = 'some-top-stats-html'
      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      expect(await topStats.renderToString()).toEqual(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      const renderNode = await topStats.renderToNode()
      expect(renderNode.textContent).toBe(mockString)

      axiosMock.post.mockResolvedValueOnce({ data: mockString })
      await topStats.render()
      expect(document.querySelector(containerSelector)?.innerHTML).toEqual(mockString)
    })
  })
})
