import { afterEach, describe, expect, it, jest } from '@jest/globals'

jest.mock('../src/config', () => {
  const actual = jest.requireActual('../src/config') as typeof import('../src/config')
  return {
    ...actual,
    getShopUniqueName: jest.fn(() => ''),
  }
})

import { getShopUniqueName } from '../src/config'
import { isDebugEnabled, log } from '../src/debug'

const getShopUniqueNameMock = getShopUniqueName as jest.MockedFunction<typeof getShopUniqueName>

describe('isDebugEnabled', () => {
  it('is on for a hyphen-delimited gs-dev handle', () => {
    expect(isDebugEnabled('gs-dev-widgets.myshopline.com')).toBe(true)
  })

  it('is on for greenspark-dev', () => {
    expect(isDebugEnabled('merchant-greenspark-dev.myshopline.com')).toBe(true)
  })

  it('is off for a merchant handle (including bags-dev)', () => {
    expect(isDebugEnabled('bags-dev.myshopline.com')).toBe(false)
    expect(isDebugEnabled('merchant.myshopline.com')).toBe(false)
  })

  it('is off when the slug is empty', () => {
    expect(isDebugEnabled('')).toBe(false)
  })
})

describe('log', () => {
  afterEach(() => {
    getShopUniqueNameMock.mockReturnValue('')
    jest.restoreAllMocks()
  })

  it('prints on a QA slug', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined)
    getShopUniqueNameMock.mockReturnValue('gs-dev-widgets.myshopline.com')

    log('bootstrap', { targets: 0 })

    expect(spy).toHaveBeenCalledWith('[Greenspark Shopline]', 'bootstrap', { targets: 0 })
  })

  it('is silent on a merchant slug', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined)
    getShopUniqueNameMock.mockReturnValue('bags-dev.myshopline.com')

    log('bootstrap', { targets: 0 })

    expect(spy).not.toHaveBeenCalled()
  })
})
