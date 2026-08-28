import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { lineProductId, parseCart, toCents } from './cart'

describe('toCents', () => {
  it('converts ajax-cart major units to widget-api cents (docs sample 11)', () => {
    assert.equal(toCents(11), 1100)
  })

  it('rounds fractional major units', () => {
    assert.equal(toCents(10.5), 1050)
  })

  it('returns 0 for missing or non-finite values', () => {
    assert.equal(toCents(undefined), 0)
    assert.equal(toCents(Number.NaN), 0)
  })
})

describe('lineProductId', () => {
  it('prefers product_id and keeps 26-digit ids as strings', () => {
    assert.equal(
      lineProductId({
        product_id: '16012345678901234567890123',
        variant_id: '99',
        id: '1',
        sku: 'SKU',
        quantity: 1,
      }),
      '16012345678901234567890123',
    )
  })

  it('does not use sku as productId', () => {
    assert.equal(lineProductId({ sku: 'SKU-1', quantity: 1 }), '')
  })
})

describe('parseCart', () => {
  it('maps total_price through toCents and lowercases currency', () => {
    const order = parseCart({
      items: [{ product_id: 'p1', quantity: 2 }],
      currency: 'USD',
      total_price: 11,
    })
    assert.deepEqual(order, {
      lineItems: [{ productId: 'p1', quantity: 2 }],
      currency: 'usd',
      totalPrice: 1100,
    })
  })

  it('returns undefined when currency is not ISO 4217', () => {
    assert.equal(
      parseCart({
        items: [{ product_id: 'p1', quantity: 1 }],
        currency: '',
        total_price: 11,
      }),
      undefined,
    )
  })
})
