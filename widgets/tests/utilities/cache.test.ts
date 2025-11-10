// tests/utils/cache.test.ts
import { cartWidgetCache } from '@/utils/cache'
import type { CartWidgetBaseParams, OrderProduct, StoreOrder } from '@/interfaces'

describe('CartWidgetCache', () => {
  const mockResponse = '<div>Mock Widget HTML</div>'
  const locale = 'en'
  const integrationContext = 'test-shop.myshopify.com'

  const createOrder = (lineItems: Array<OrderProduct>): StoreOrder => ({
    currency: 'USD',
    totalPrice: 100,
    lineItems,
  })

  const createParams = (order: StoreOrder, version?: 'v2'): CartWidgetBaseParams & {
    version?: 'v2'
  } => ({
    order,
    ...(version && { version }),
  })

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('get and set', () => {
    test('should return null for cache miss', () => {
      const params = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))
      const result = cartWidgetCache.get(params, locale, integrationContext)
      expect(result).toBeNull()
    })

    test('should store and retrieve cached response', () => {
      const params = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))

      cartWidgetCache.set(params, mockResponse, locale, integrationContext)
      const result = cartWidgetCache.get(params, locale, integrationContext)

      expect(result).toBe(mockResponse)
    })

    test('should return different responses for different params', () => {
      const params1 = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))
      const params2 = createParams(createOrder([{ productId: 'product-2', quantity: 1 }]))
      const response1 = '<div>Response 1</div>'
      const response2 = '<div>Response 2</div>'

      cartWidgetCache.set(params1, response1, locale, integrationContext)
      cartWidgetCache.set(params2, response2, locale, integrationContext)

      expect(cartWidgetCache.get(params1, locale, integrationContext)).toBe(response1)
      expect(cartWidgetCache.get(params2, locale, integrationContext)).toBe(response2)
    })

    test('should return different responses for different locales', () => {
      const params = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))
      const responseEn = '<div>English</div>'
      const responseFr = '<div>Français</div>'

      cartWidgetCache.set(params, responseEn, 'en', integrationContext)
      cartWidgetCache.set(params, responseFr, 'fr', integrationContext)

      expect(cartWidgetCache.get(params, 'en', integrationContext)).toBe(responseEn)
      expect(cartWidgetCache.get(params, 'fr', integrationContext)).toBe(responseFr)
    })

    test('should return different responses for different integration contexts', () => {
      const params = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))
      const response1 = '<div>Shop 1</div>'
      const response2 = '<div>Shop 2</div>'

      cartWidgetCache.set(params, response1, locale, 'shop-1.myshopify.com')
      cartWidgetCache.set(params, response2, locale, 'shop-2.myshopify.com')

      expect(cartWidgetCache.get(params, locale, 'shop-1.myshopify.com')).toBe(response1)
      expect(cartWidgetCache.get(params, locale, 'shop-2.myshopify.com')).toBe(response2)
    })

    test('should return different responses for different versions', () => {
      const order = createOrder([{ productId: 'product-1', quantity: 1 }])
      const paramsV1 = createParams(order)
      const paramsV2 = createParams(order, 'v2')
      const responseV1 = '<div>Version 1</div>'
      const responseV2 = '<div>Version 2</div>'

      cartWidgetCache.set(paramsV1, responseV1, locale, integrationContext)
      cartWidgetCache.set(paramsV2, responseV2, locale, integrationContext)

      expect(cartWidgetCache.get(paramsV1, locale, integrationContext)).toBe(responseV1)
      expect(cartWidgetCache.get(paramsV2, locale, integrationContext)).toBe(responseV2)
    })
  })

  describe('TTL expiration', () => {
    test('should return cached response within TTL', () => {
      const params = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))

      cartWidgetCache.set(params, mockResponse, locale, integrationContext)

      // Advance time by 19 seconds (within 20 second TTL)
      jest.advanceTimersByTime(19_000)

      const result = cartWidgetCache.get(params, locale, integrationContext)
      expect(result).toBe(mockResponse)
    })

    test('should return null after TTL expires', () => {
      const params = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))

      cartWidgetCache.set(params, mockResponse, locale, integrationContext)

      // Advance time by 21 seconds (beyond 20 second TTL)
      jest.advanceTimersByTime(21_000)

      const result = cartWidgetCache.get(params, locale, integrationContext)
      expect(result).toBeNull()
    })

    test('should remove expired entry on get', () => {
      const params = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))

      cartWidgetCache.set(params, mockResponse, locale, integrationContext)

      // Advance time beyond TTL
      jest.advanceTimersByTime(21_000)

      // First get should return null and remove the entry
      expect(cartWidgetCache.get(params, locale, integrationContext)).toBeNull()

      // Second get should also return null (entry was removed)
      expect(cartWidgetCache.get(params, locale, integrationContext)).toBeNull()
    })
  })

  describe('cache key normalization', () => {
    test('should generate same cache key for orders with same items in different order', () => {
      const order1 = createOrder([
        { productId: 'product-1', quantity: 1 },
        { productId: 'product-2', quantity: 2 },
      ])
      const order2 = createOrder([
        { productId: 'product-2', quantity: 2 },
        { productId: 'product-1', quantity: 1 },
      ])
      const params1 = createParams(order1)
      const params2 = createParams(order2)

      cartWidgetCache.set(params1, mockResponse, locale, integrationContext)
      const result = cartWidgetCache.get(params2, locale, integrationContext)

      expect(result).toBe(mockResponse)
    })

    test('should generate different cache keys for orders with different items', () => {
      const order1 = createOrder([{ productId: 'product-1', quantity: 1 }])
      const order2 = createOrder([{ productId: 'product-2', quantity: 1 }])
      const params1 = createParams(order1)
      const params2 = createParams(order2)
      const response1 = '<div>Response 1</div>'
      const response2 = '<div>Response 2</div>'

      cartWidgetCache.set(params1, response1, locale, integrationContext)
      cartWidgetCache.set(params2, response2, locale, integrationContext)

      expect(cartWidgetCache.get(params1, locale, integrationContext)).toBe(response1)
      expect(cartWidgetCache.get(params2, locale, integrationContext)).toBe(response2)
    })

    test('should generate different cache keys for orders with different quantities', () => {
      const order1 = createOrder([{ productId: 'product-1', quantity: 1 }])
      const order2 = createOrder([{ productId: 'product-1', quantity: 2 }])
      const params1 = createParams(order1)
      const params2 = createParams(order2)
      const response1 = '<div>Quantity 1</div>'
      const response2 = '<div>Quantity 2</div>'

      cartWidgetCache.set(params1, response1, locale, integrationContext)
      cartWidgetCache.set(params2, response2, locale, integrationContext)

      expect(cartWidgetCache.get(params1, locale, integrationContext)).toBe(response1)
      expect(cartWidgetCache.get(params2, locale, integrationContext)).toBe(response2)
    })

    test('should generate different cache keys for orders with different currencies', () => {
      const order1: StoreOrder = {
        currency: 'USD',
        totalPrice: 100,
        lineItems: [{ productId: 'product-1', quantity: 1 }],
      }
      const order2: StoreOrder = {
        currency: 'EUR',
        totalPrice: 100,
        lineItems: [{ productId: 'product-1', quantity: 1 }],
      }
      const params1 = createParams(order1)
      const params2 = createParams(order2)
      const response1 = '<div>USD</div>'
      const response2 = '<div>EUR</div>'

      cartWidgetCache.set(params1, response1, locale, integrationContext)
      cartWidgetCache.set(params2, response2, locale, integrationContext)

      expect(cartWidgetCache.get(params1, locale, integrationContext)).toBe(response1)
      expect(cartWidgetCache.get(params2, locale, integrationContext)).toBe(response2)
    })
  })

  describe('edge cases', () => {
    test('should handle empty line items array', () => {
      const params = createParams(createOrder([]))

      cartWidgetCache.set(params, mockResponse, locale, integrationContext)
      const result = cartWidgetCache.get(params, locale, integrationContext)

      expect(result).toBe(mockResponse)
    })

    test('should handle undefined integration context', () => {
      const params = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))

      cartWidgetCache.set(params, mockResponse, locale, undefined)
      const result = cartWidgetCache.get(params, locale, undefined)

      expect(result).toBe(mockResponse)
    })

    test('should handle empty string integration context', () => {
      const params = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))

      cartWidgetCache.set(params, mockResponse, locale, '')
      const result = cartWidgetCache.get(params, locale, '')

      expect(result).toBe(mockResponse)
    })

    test('should handle orders with many line items', () => {
      const lineItems: Array<OrderProduct> = Array.from({ length: 100 }, (_, i) => ({
        productId: `product-${i}`,
        quantity: i + 1,
      }))
      const params = createParams(createOrder(lineItems))

      cartWidgetCache.set(params, mockResponse, locale, integrationContext)
      const result = cartWidgetCache.get(params, locale, integrationContext)

      expect(result).toBe(mockResponse)
    })

    test('should handle special characters in product IDs', () => {
      const order = createOrder([
        { productId: 'product-with-special-chars-!@#$%', quantity: 1 },
      ])
      const params = createParams(order)

      cartWidgetCache.set(params, mockResponse, locale, integrationContext)
      const result = cartWidgetCache.get(params, locale, integrationContext)

      expect(result).toBe(mockResponse)
    })
  })

  describe('cache cleanup', () => {
    test('should cleanup expired entries on set', () => {
      const params1 = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))
      const params2 = createParams(createOrder([{ productId: 'product-2', quantity: 1 }]))

      // Set first entry
      cartWidgetCache.set(params1, '<div>Response 1</div>', locale, integrationContext)

      // Advance time beyond TTL
      jest.advanceTimersByTime(21_000)

      // Set second entry - this should trigger cleanup
      cartWidgetCache.set(params2, '<div>Response 2</div>', locale, integrationContext)

      // First entry should be removed
      expect(cartWidgetCache.get(params1, locale, integrationContext)).toBeNull()
      // Second entry should still be available
      expect(cartWidgetCache.get(params2, locale, integrationContext)).toBe('<div>Response 2</div>')
    })
  })

  describe('cache key consistency', () => {
    test('should generate consistent keys for identical params', () => {
      const params1 = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))
      const params2 = createParams(createOrder([{ productId: 'product-1', quantity: 1 }]))

      cartWidgetCache.set(params1, mockResponse, locale, integrationContext)
      const result = cartWidgetCache.get(params2, locale, integrationContext)

      expect(result).toBe(mockResponse)
    })
  })
})
