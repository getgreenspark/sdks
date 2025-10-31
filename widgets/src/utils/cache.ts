import type { CartWidgetBaseParams, OrderProduct } from '@/interfaces'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

/**
 * Cache utility for cart widget requests with TTL support
 * Provides in-memory caching to prevent request bursts
 */
class CartWidgetCache {
  private cache: Map<string, CacheEntry<string>> = new Map()
  private readonly TTL: number = 20_000 // 20 seconds in milliseconds

  /**
   * Retrieves a cached entry if it exists and hasn't expired
   * @returns The cached response or null if cache miss/expired
   */
  get<TParams extends CartWidgetBaseParams>(
    params: TParams,
    locale: string,
    integrationContext?: string,
  ): string | null {
    const key = this.generateCacheKey(params, locale, integrationContext)
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    const now = Date.now()
    const age = now - entry.timestamp

    if (age > this.TTL) {
      // Entry expired, remove it
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Stores a response in the cache
   */
  set<TParams extends CartWidgetBaseParams>(
    params: TParams,
    response: string,
    locale: string,
    integrationContext?: string,
  ): void {
    const key = this.generateCacheKey(params, locale, integrationContext)
    this.cache.set(key, {
      data: response,
      timestamp: Date.now(),
    })

    // Clean up expired entries periodically (when cache size grows)
    // This is a simple approach - in production you might want more sophisticated cleanup
    if (this.cache.size > 20) {
      this.cleanup()
    }
  }


  /**
   * Normalizes lineItems array by sorting by productId to ensure consistent cache keys for identical orders
   */
  private normalizeLineItems(lineItems: Array<OrderProduct>): Array<OrderProduct> {
    return [...lineItems].sort((a, b) => a.productId.localeCompare(b.productId))
  }

  /**
   * Generates a consistent cache key from request parameters Normalizes order.lineItems and sorts object keys for consistency
   */
  private generateCacheKey<TParams extends CartWidgetBaseParams>(
    params: TParams,
    locale: string,
    integrationContext?: string,
  ): string {
    // Create a normalized copy of params
    const normalized = {
      ...params,
      lineItems: this.normalizeLineItems(params?.order?.lineItems || []),
    }

    // Add locale and integration context to ensure cache separation
    const cacheParams = {
      ...normalized,
      _locale: locale,
      _integrationContext: integrationContext || '',
    }

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
      if (now - entry.timestamp > this.TTL) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach((key) => this.cache.delete(key))
  }
}

// Export a singleton instance
export const cartWidgetCache = new CartWidgetCache()

