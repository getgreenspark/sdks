import { describe, expect, it } from '@jest/globals'
import {
  CART_DRAWER_SELECTORS,
  WIDGET_INSTANCE_SELECTOR,
  collectUnmountedTargets,
  isInsideCartDrawer,
  partitionDrawerTargets,
} from '../src/selectors'

describe('CART_DRAWER_SELECTORS', () => {
  it('covers the OS 2.0 cart drawer custom elements', () => {
    expect(CART_DRAWER_SELECTORS).toEqual(['theme-cart-drawer', 'theme-cart-fixed-checkout'])
  })
})

describe('collectUnmountedTargets', () => {
  it('keeps a target that has no instance child', () => {
    const bare = { id: 'bare', querySelector: () => null }
    const mounted = {
      id: 'mounted',
      querySelector: (selector: string) => (selector === WIDGET_INSTANCE_SELECTOR ? {} : null),
    }

    expect(collectUnmountedTargets([bare, mounted])).toEqual([bare])
  })

  it('returns empty when every target already has an instance', () => {
    const mounted = { querySelector: () => ({}) }
    expect(collectUnmountedTargets([mounted])).toEqual([])
  })
})

describe('isInsideCartDrawer', () => {
  it('is true when closest hits a drawer custom element', () => {
    expect(
      isInsideCartDrawer({
        closest: (selector: string) => (selector === 'theme-cart-drawer' ? {} : null),
      }),
    ).toBe(true)
  })

  it('is false when the node is not in a drawer', () => {
    expect(isInsideCartDrawer({ closest: () => null })).toBe(false)
  })
})

describe('partitionDrawerTargets', () => {
  it('splits page widgets from drawer widgets', () => {
    const page = { id: 'page', closest: () => null }
    const drawer = {
      id: 'drawer',
      closest: (selector: string) => (selector === 'theme-cart-fixed-checkout' ? {} : null),
    }

    expect(partitionDrawerTargets([page, drawer])).toEqual({
      pageTargets: [page],
      drawerTargets: [drawer],
    })
  })
})
