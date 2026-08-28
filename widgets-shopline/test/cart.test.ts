import { describe, expect, it } from '@jest/globals'
import { lineProductId, parseCart, toCents } from '../src/cart'

describe('toCents', () => {
  it('converts ajax-cart major units to widget-api cents (docs sample 11)', () => {
    expect(toCents(11)).toBe(1100)
  })

  it('rounds fractional major units', () => {
    expect(toCents(10.5)).toBe(1050)
  })

  it('returns 0 for missing or non-finite values', () => {
    expect(toCents(undefined)).toBe(0)
    expect(toCents(Number.NaN)).toBe(0)
  })
})

describe('lineProductId', () => {
  it('prefers product_id and keeps 26-digit ids as strings', () => {
    expect(
      lineProductId({
        product_id: '16012345678901234567890123',
        variant_id: '99',
        id: '1',
        sku: 'SKU',
        quantity: 1,
      }),
    ).toBe('16012345678901234567890123')
  })

  it('does not use sku as productId', () => {
    expect(lineProductId({ sku: 'SKU-1', quantity: 1 })).toBe('')
  })
})

describe('parseCart', () => {
  it('maps total_price through toCents and lowercases currency', () => {
    const order = parseCart({
      items: [{ product_id: 'p1', quantity: 2 }],
      currency: 'USD',
      total_price: 11,
    })
    expect(order).toEqual({
      lineItems: [{ productId: 'p1', quantity: 2 }],
      currency: 'usd',
      totalPrice: 1100,
    })
  })

  it('returns undefined when currency is not ISO 4217', () => {
    expect(
      parseCart({
        items: [{ product_id: 'p1', quantity: 1 }],
        currency: '',
        total_price: 11,
      }),
    ).toBeUndefined()
  })
})
