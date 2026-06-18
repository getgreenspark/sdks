import type { OrderProduct, StoreOrder } from '@/interfaces'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

type WidgetHtmlCacheKey = {
  order?: StoreOrder
} & object

/**
 * Cache utility for widget HTML requests with TTL support
 * Provides in-memory caching to prevent request bursts
 */
class WidgetHtmlCache {
  private static readonly TTL: number = 20_000 as const // 20 seconds in milliseconds
  private static readonly UNAUTHORIZED_TTL: number = 60_000 as const
  private cache: Map<string, CacheEntry<string>> = new Map()
  private unauthorizedCache: Map<string, CacheEntry<number>> = new Map()

  /**
   * Retrieves a cached entry if it exists and hasn't expired
   * @returns The cached response or null if cache miss/expired
   */
  get(key: WidgetHtmlCacheKey): string | null {
    const cacheKey = this.generateCacheKey(key)
    const entry = this.cache.get(cacheKey)

    if (!entry) {
      return null
    }

    const now = Date.now()
    const age = now - entry.timestamp

    if (age > WidgetHtmlCache.TTL) {
      // Entry expired, remove it
      this.cache.delete(cacheKey)
      return null
    }

    this.cleanup()

    return entry.data
  }

  /**
   * Stores a response in the cache
   */
  set(key: WidgetHtmlCacheKey, response: string): void {
    const cacheKey = this.generateCacheKey(key)
    this.cache.set(cacheKey, {
      data: response,
      timestamp: Date.now(),
    })

    this.cleanup()
  }

  getUnauthorizedStatus(key: WidgetHtmlCacheKey): number | null {
    const cacheKey = this.generateCacheKey(key)
    const entry = this.unauthorizedCache.get(cacheKey)

    if (!entry) {
      return null
    }

    if (Date.now() - entry.timestamp > WidgetHtmlCache.UNAUTHORIZED_TTL) {
      this.unauthorizedCache.delete(cacheKey)
      return null
    }

    this.cleanup()

    return entry.data
  }

  setUnauthorizedStatus(key: WidgetHtmlCacheKey, status: number): void {
    this.unauthorizedCache.set(this.generateCacheKey(key), {
      data: status,
      timestamp: Date.now(),
    })

    this.cleanup()
  }

  /**
   * Clears all cache entries (useful for testing)
   */
  clear(): void {
    this.cache.clear()
    this.unauthorizedCache.clear()
  }

  /**
   * Normalizes lineItems array by sorting by productId to ensure consistent cache keys for identical orders
   */
  private normalizeLineItems(lineItems: Array<OrderProduct>): Array<OrderProduct> {
    return [...lineItems].sort((a, b) => {
      const aId = String(a.productId)
      const bId = String(b.productId)
      return aId.localeCompare(bId)
    })
  }

  /**
   * Generates a consistent cache key from request parameters. Normalizes cart order.lineItems when present and sorts object keys for consistency.
   */
  private generateCacheKey(params: WidgetHtmlCacheKey): string {
    const cacheParams = params.order
      ? {
        ...params,
        order: {
          ...params.order,
          lineItems: this.normalizeLineItems(params.order.lineItems || []),
        },
      }
      : params

    // Sort keys to ensure consistent cache keys
    const sortedParams = Object.fromEntries(
      Object.entries(cacheParams).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
    )

    return JSON.stringify(sortedParams)
  }

  /**
   * Removes expired entries from the cache
   */
  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > WidgetHtmlCache.TTL) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach((key) => this.cache.delete(key))

    const unauthorizedKeysToDelete: string[] = []
    this.unauthorizedCache.forEach((entry, key) => {
      if (now - entry.timestamp > WidgetHtmlCache.UNAUTHORIZED_TTL) {
        unauthorizedKeysToDelete.push(key)
      }
    })
    unauthorizedKeysToDelete.forEach((key) => this.unauthorizedCache.delete(key))
  }
}

export const widgetHtmlCache = new WidgetHtmlCache()

