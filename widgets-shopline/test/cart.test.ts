import { describe, expect, it } from '@jest/globals'
import { lineProductId, parseCart, parseMajorUnits, toCents } from '../src/cart'

describe('parseMajorUnits', () => {
  it('keeps numeric major units', () => {
    expect(parseMajorUnits(11)).toBe(11)
    expect(parseMajorUnits(10.5)).toBe(10.5)
    expect(parseMajorUnits(0)).toBe(0)
  })

  it('parses quoted ajax-cart totals (Hotglue parseMoneyString)', () => {
    expect(parseMajorUnits('11')).toBe(11)
    expect(parseMajorUnits('11.00')).toBe(11)
    expect(parseMajorUnits(' 10.5 ')).toBe(10.5)
  })

  it('rejects missing, empty, non-finite, and negative values', () => {
    expect(parseMajorUnits(undefined)).toBeUndefined()
    expect(parseMajorUnits('')).toBeUndefined()
    expect(parseMajorUnits('abc')).toBeUndefined()
    expect(parseMajorUnits(Number.NaN)).toBeUndefined()
    expect(parseMajorUnits(Number.POSITIVE_INFINITY)).toBeUndefined()
    expect(parseMajorUnits(-1)).toBeUndefined()
  })
})

describe('toCents', () => {
  it('converts ajax-cart major units to widget-api cents (docs sample 11)', () => {
    expect(toCents(11)).toBe(1100)
  })

  it('rounds fractional major units', () => {
    expect(toCents(10.5)).toBe(1050)
  })

  it('converts quoted major units to cents', () => {
    expect(toCents('11')).toBe(1100)
    expect(toCents('11.00')).toBe(1100)
  })

  it('returns undefined for missing or non-finite values (does not substitute 0)', () => {
    expect(toCents(undefined)).toBeUndefined()
    expect(toCents(Number.NaN)).toBeUndefined()
    expect(toCents('abc')).toBeUndefined()
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

  it('returns empty when only variant_id is present', () => {
    expect(lineProductId({ variant_id: '99', quantity: 1 })).toBe('')
  })

  it('returns empty when only line id is present', () => {
    expect(lineProductId({ id: '1', quantity: 1 })).toBe('')
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

  it('coerces quoted total_price and quantity instead of painting $0', () => {
    const order = parseCart({
      items: [{ product_id: 'p1', quantity: '2' }],
      currency: 'USD',
      total_price: '11.00',
    })
    expect(order).toEqual({
      lineItems: [{ productId: 'p1', quantity: 2 }],
      currency: 'usd',
      totalPrice: 1100,
    })
  })

  it('returns undefined when items exist but total_price is unparseable', () => {
    expect(
      parseCart({
        items: [{ product_id: 'p1', quantity: 1 }],
        currency: 'USD',
        total_price: 'abc',
      }),
    ).toBeUndefined()
    expect(
      parseCart({
        items: [{ product_id: 'p1', quantity: 1 }],
        currency: 'USD',
      }),
    ).toBeUndefined()
  })

  it('treats an empty cart with missing total as $0 so the mount can clear', () => {
    expect(parseCart({ items: [], currency: 'USD' })).toEqual({
      lineItems: [],
      currency: 'usd',
      totalPrice: 0,
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

  it('omits items without product_id or a finite positive quantity', () => {
    const order = parseCart({
      items: [
        { variant_id: 'v1', id: 'line-1', quantity: 1 },
        { product_id: 'p1', quantity: 2 },
        { id: 'line-2', sku: 'SKU', quantity: 3 },
        { product_id: 'p2', quantity: 'nope' },
        { product_id: 'p3', quantity: 0 },
      ],
      currency: 'USD',
      total_price: 11,
    })
    expect(order?.lineItems).toEqual([{ productId: 'p1', quantity: 2 }])
  })
})
