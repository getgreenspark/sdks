import { describe, expect, it } from '@jest/globals'
import type { CartOrderPayload } from '../src/interfaces'
import { parseCart } from '../src/cart'
import { shouldClearOrderImpactsMount } from '../src/widgets'

const emptyOrder: CartOrderPayload = {
  lineItems: [],
  currency: 'usd',
  totalPrice: 0,
}

const orderWithItems: CartOrderPayload = {
  lineItems: [{ productId: 'p1', quantity: 1 }],
  currency: 'usd',
  totalPrice: 1100,
}

describe('shouldClearOrderImpactsMount', () => {
  it('does not clear when order is undefined (invalid or missing currency)', () => {
    expect(shouldClearOrderImpactsMount(undefined)).toBe(false)
    expect(
      shouldClearOrderImpactsMount(
        parseCart({ items: [{ product_id: 'p1', quantity: 1 }], currency: '', total_price: 11 }),
      ),
    ).toBe(false)
  })

  it('clears when the order is valid and lineItems is empty', () => {
    expect(shouldClearOrderImpactsMount(emptyOrder)).toBe(true)
  })

  it('does not clear when the order has line items', () => {
    expect(shouldClearOrderImpactsMount(orderWithItems)).toBe(false)
  })
})
