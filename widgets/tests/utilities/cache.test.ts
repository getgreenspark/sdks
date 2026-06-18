// tests/utils/cache.test.ts
import { widgetHtmlCache } from '@/utils/cache'
import type { OrderProduct, StoreOrder } from '@/interfaces'

describe('WidgetHtmlCache', () => {
  const mockResponse = '<div>Mock Widget HTML</div>'
  const locale = 'en'
  const integrationContext = 'test-shop.myshopify.com'

  const createOrder = (lineItems: Array<OrderProduct>): StoreOrder => ({
    currency: 'USD',
    totalPrice: 100,
    lineItems,
  })

  const createKey = (
    body: object,
    keyLocale = locale,
    keyIntegrationContext = integrationContext,
  ): object => ({
    ...body,
    _endpoint: '/widgets/cart-widget',
    _locale: keyLocale,
    _integrationContext: keyIntegrationContext,
  })

  beforeEach(() => {
    jest.useFakeTimers()
    widgetHtmlCache.clear()
  })

  afterEach(() => {
    widgetHtmlCache.clear()
    jest.useRealTimers()
  })

  describe('get and set', () => {
    test('should return null for cache miss', () => {
      const key = createKey({ order: createOrder([{ productId: 'product-1', quantity: 1 }]) })

      expect(widgetHtmlCache.get(key)).toBeNull()
    })

    test('should store and retrieve cached response', () => {
      const key = createKey({ order: createOrder([{ productId: 'product-1', quantity: 1 }]) })

      widgetHtmlCache.set(key, mockResponse)

      expect(widgetHtmlCache.get(key)).toBe(mockResponse)
    })

    test('should return different responses for different bodies', () => {
      const key1 = createKey({ order: createOrder([{ productId: 'product-1', quantity: 1 }]) })
      const key2 = createKey({ order: createOrder([{ productId: 'product-2', quantity: 1 }]) })

      widgetHtmlCache.set(key1, '<div>Response 1</div>')
      widgetHtmlCache.set(key2, '<div>Response 2</div>')

      expect(widgetHtmlCache.get(key1)).toBe('<div>Response 1</div>')
      expect(widgetHtmlCache.get(key2)).toBe('<div>Response 2</div>')
    })

    test('should return different responses for different locales', () => {
      const body = { order: createOrder([{ productId: 'product-1', quantity: 1 }]) }
      const keyEn = createKey(body, 'en')
      const keyFr = createKey(body, 'fr')

      widgetHtmlCache.set(keyEn, '<div>English</div>')
      widgetHtmlCache.set(keyFr, '<div>French</div>')

      expect(widgetHtmlCache.get(keyEn)).toBe('<div>English</div>')
      expect(widgetHtmlCache.get(keyFr)).toBe('<div>French</div>')
    })

    test('should return different responses for different integration contexts', () => {
      const body = { order: createOrder([{ productId: 'product-1', quantity: 1 }]) }
      const key1 = createKey(body, locale, 'shop-1.myshopify.com')
      const key2 = createKey(body, locale, 'shop-2.myshopify.com')

      widgetHtmlCache.set(key1, '<div>Shop 1</div>')
      widgetHtmlCache.set(key2, '<div>Shop 2</div>')

      expect(widgetHtmlCache.get(key1)).toBe('<div>Shop 1</div>')
      expect(widgetHtmlCache.get(key2)).toBe('<div>Shop 2</div>')
    })
  })

  describe('TTL expiration', () => {
    test('should return cached response within TTL', () => {
      const key = createKey({ order: createOrder([{ productId: 'product-1', quantity: 1 }]) })

      widgetHtmlCache.set(key, mockResponse)
      jest.advanceTimersByTime(19_000)

      expect(widgetHtmlCache.get(key)).toBe(mockResponse)
    })

    test('should return null after TTL expires', () => {
      const key = createKey({ order: createOrder([{ productId: 'product-1', quantity: 1 }]) })

      widgetHtmlCache.set(key, mockResponse)
      jest.advanceTimersByTime(21_000)

      expect(widgetHtmlCache.get(key)).toBeNull()
    })
  })

  describe('cache key normalization', () => {
    test('should generate same cache key for orders with same items in different order', () => {
      const key1 = createKey({
        order: createOrder([
          { productId: 'product-1', quantity: 1 },
          { productId: 'product-2', quantity: 2 },
        ]),
      })
      const key2 = createKey({
        order: createOrder([
          { productId: 'product-2', quantity: 2 },
          { productId: 'product-1', quantity: 1 },
        ]),
      })

      widgetHtmlCache.set(key1, mockResponse)

      expect(widgetHtmlCache.get(key2)).toBe(mockResponse)
    })

    test('should generate different cache keys for orders with different quantities', () => {
      const key1 = createKey({ order: createOrder([{ productId: 'product-1', quantity: 1 }]) })
      const key2 = createKey({ order: createOrder([{ productId: 'product-1', quantity: 2 }]) })

      widgetHtmlCache.set(key1, '<div>Quantity 1</div>')
      widgetHtmlCache.set(key2, '<div>Quantity 2</div>')

      expect(widgetHtmlCache.get(key1)).toBe('<div>Quantity 1</div>')
      expect(widgetHtmlCache.get(key2)).toBe('<div>Quantity 2</div>')
    })

    test('should handle keys without an order object', () => {
      const key = createKey({
        widgetId: 'widget-123',
        productId: 'product-1',
      })

      widgetHtmlCache.set(key, mockResponse)

      expect(widgetHtmlCache.get(key)).toBe(mockResponse)
    })
  })

  describe('cache cleanup', () => {
    test('should cleanup expired entries on set', () => {
      const key1 = createKey({ order: createOrder([{ productId: 'product-1', quantity: 1 }]) })
      const key2 = createKey({ order: createOrder([{ productId: 'product-2', quantity: 1 }]) })

      widgetHtmlCache.set(key1, '<div>Response 1</div>')
      jest.advanceTimersByTime(21_000)
      widgetHtmlCache.set(key2, '<div>Response 2</div>')

      expect(widgetHtmlCache.get(key1)).toBeNull()
      expect(widgetHtmlCache.get(key2)).toBe('<div>Response 2</div>')
    })
  })
})
