import { afterEach, describe, expect, it } from '@jest/globals'
import type { CartOrderPayload } from '../src/interfaces'
import {
  beginDrawerStash,
  dropDrawerClone,
  isCurrentStashGen,
  pickDrawerRestoreKind,
  rememberStashedOrder,
  takeStashedOrder,
} from '../src/drawer-stash'

const order: CartOrderPayload = {
  lineItems: [{ productId: 'p1', quantity: 2 }],
  currency: 'usd',
  totalPrice: 2000,
}

describe('pickDrawerRestoreKind', () => {
  it('does not replace a widget that is still mounted', () => {
    expect(pickDrawerRestoreKind(true, true, true)).toBe('none')
  })

  it('prefers the pre-rendered node over the old clone', () => {
    expect(pickDrawerRestoreKind(false, true, true)).toBe('painted')
  })

  it('falls back to the clone when paint is not ready', () => {
    expect(pickDrawerRestoreKind(false, false, true)).toBe('clone')
  })

  it('returns none when there is nothing to restore', () => {
    expect(pickDrawerRestoreKind(false, false, false)).toBe('none')
  })
})

describe('drawer stash generation and order cache', () => {
  afterEach(() => {
    beginDrawerStash('t1', null)
  })

  it('invalidates the previous gen on a new stash', () => {
    const first = beginDrawerStash('t1', null)
    const second = beginDrawerStash('t1', null)
    expect(isCurrentStashGen('t1', first)).toBe(false)
    expect(isCurrentStashGen('t1', second)).toBe(true)
  })

  it('returns and consumes a stashed order once', () => {
    beginDrawerStash('t1', null)
    rememberStashedOrder('t1', order)
    expect(takeStashedOrder('t1')).toEqual(order)
    expect(takeStashedOrder('t1')).toBeUndefined()
  })

  it('drops an empty-cart clone without bumping past the current gen', () => {
    const gen = beginDrawerStash('t1', null)
    dropDrawerClone('t1')
    expect(isCurrentStashGen('t1', gen)).toBe(true)
  })
})
