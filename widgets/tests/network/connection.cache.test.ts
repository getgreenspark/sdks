// tests/network/connection.cache.test.ts
import axios from 'axios'
import { ConnectionHandler } from '@/network/connection'
import { cartWidgetCache } from '@/utils/cache'
import apiFixtures from '@tests/fixtures/api.json'
import orderFixtures from '@tests/fixtures/order.json'
import type { StoreOrder } from '@/interfaces'

jest.mock('axios')
const axiosMock = axios as jest.Mocked<typeof axios>

const API_KEY = apiFixtures.default.apiKey as string
const INTEGRATION_SLUG = apiFixtures.default.integrationSlug as string
const BASIC_ORDER = orderFixtures.basic as StoreOrder

describe('ConnectionHandler - Cache Integration', () => {
  let connection: ConnectionHandler
  const mockHtml = '<div>Mock Widget HTML</div>'

  beforeEach(() => {
    jest.useFakeTimers()
    cartWidgetCache.clear()
    connection = new ConnectionHandler({
      apiKey: API_KEY,
      integrationSlug: INTEGRATION_SLUG,
      locale: 'en',
    })
    axiosMock.post.mockClear()
  })

  afterEach(() => {
    cartWidgetCache.clear()
    jest.useRealTimers()
  })

  describe('fetchCartWidget caching', () => {
    test('should cache response and return cached value on subsequent calls', async () => {
      axiosMock.post.mockResolvedValueOnce({ data: mockHtml })

      const params = {
        color: 'beige' as const,
        order: BASIC_ORDER,
      }

      // First call - should make API request
      const promise1 = connection.fetchCartWidget(params)
      await jest.runAllTimersAsync()
      const result1 = await promise1
      expect(result1).toBe(mockHtml)
      expect(axiosMock.post).toHaveBeenCalledTimes(1)

      // Second call - should return cached value
      const result2 = await connection.fetchCartWidget(params)
      expect(result2).toBe(mockHtml)
      expect(axiosMock.post).toHaveBeenCalledTimes(1) // Still only 1 call
    })

    test('should make new API call after cache expires', async () => {
      axiosMock.post.mockResolvedValue({ data: mockHtml })

      const params = {
        color: 'beige' as const,
        order: BASIC_ORDER,
      }

      // First call
      const promise1 = connection.fetchCartWidget(params)
      await jest.runAllTimersAsync()
      await promise1
      expect(axiosMock.post).toHaveBeenCalledTimes(1)

      // Advance time beyond TTL
      jest.advanceTimersByTime(21_000)

      // Second call after expiration - should make new API request
      const promise2 = connection.fetchCartWidget(params)
      await jest.runAllTimersAsync()
      await promise2
      expect(axiosMock.post).toHaveBeenCalledTimes(2)
    })

    test('should cache separately for different orders', async () => {
      const order1 = { ...BASIC_ORDER, lineItems: [{ productId: 'product-1', quantity: 1 }] }
      const order2 = { ...BASIC_ORDER, lineItems: [{ productId: 'product-2', quantity: 1 }] }

      axiosMock.post.mockResolvedValue({ data: mockHtml })

      const promise1 = connection.fetchCartWidget({ color: 'beige' as const, order: order1 })
      await jest.runAllTimersAsync()
      await promise1

      const promise2 = connection.fetchCartWidget({ color: 'beige' as const, order: order2 })
      await jest.runAllTimersAsync()
      await promise2

      expect(axiosMock.post).toHaveBeenCalledTimes(2)
    })

    test('should cache separately for different locales', async () => {
      const connectionEn = new ConnectionHandler({
        apiKey: API_KEY,
        integrationSlug: INTEGRATION_SLUG,
        locale: 'en',
      })
      const connectionFr = new ConnectionHandler({
        apiKey: API_KEY,
        integrationSlug: INTEGRATION_SLUG,
        locale: 'fr',
      })

      axiosMock.post.mockResolvedValue({ data: mockHtml })

      const promise1 = connectionEn.fetchCartWidget({ color: 'beige' as const, order: BASIC_ORDER })
      await jest.runAllTimersAsync()
      await promise1

      const promise2 = connectionFr.fetchCartWidget({ color: 'beige' as const, order: BASIC_ORDER })
      await jest.runAllTimersAsync()
      await promise2

      expect(axiosMock.post).toHaveBeenCalledTimes(2)
    })
  })

  describe('fetchCartWidgetById caching', () => {
    test('should cache response for cart widget by ID', async () => {
      axiosMock.post.mockResolvedValueOnce({ data: mockHtml })

      const params = {
        widgetId: 'widget-123',
        order: BASIC_ORDER,
        version: 'v2' as const,
      }

      const promise1 = connection.fetchCartWidgetById(params)
      await jest.runAllTimersAsync()
      await promise1
      expect(axiosMock.post).toHaveBeenCalledTimes(1)

      const result = await connection.fetchCartWidgetById(params)
      expect(result).toBe(mockHtml)
      expect(axiosMock.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('fetchCustomerCartContributionWidget caching', () => {
    test('should cache response for customer cart contribution widget', async () => {
      axiosMock.post.mockResolvedValueOnce({ data: mockHtml })

      const params = {
        color: 'beige' as const,
        order: BASIC_ORDER,
      }

      const promise1 = connection.fetchCustomerCartContributionWidget(params)
      await jest.runAllTimersAsync()
      await promise1
      expect(axiosMock.post).toHaveBeenCalledTimes(1)

      const result = await connection.fetchCustomerCartContributionWidget(params)
      expect(result).toBe(mockHtml)
      expect(axiosMock.post).toHaveBeenCalledTimes(1)
    })
  })
})
