import { describe, expect, it } from '@jest/globals'
import {
  isGsDevStore,
  parseCurrency,
  resolveIntegrationSlug,
  widgetSdkUrl,
  PINNED_WIDGET_SDK_URL,
  LATEST_WIDGET_SDK_URL,
} from '../src/config'

describe('isGsDevStore', () => {
  it('treats a hyphen-delimited gs-dev handle as QA', () => {
    expect(isGsDevStore('gs-dev-shop.myshopline.com')).toBe(true)
  })

  it('treats greenspark-dev as QA', () => {
    expect(isGsDevStore('merchant-greenspark-dev.myshopline.com')).toBe(true)
  })

  it('does not treat bags-dev as QA (substring gs-dev in bags-dev)', () => {
    expect(isGsDevStore('bags-dev.myshopline.com')).toBe(false)
  })

  it('does not treat a custom domain hostname as QA', () => {
    expect(isGsDevStore('www.example.com')).toBe(false)
  })
})

describe('resolveIntegrationSlug', () => {
  it('prefers the script attribute', () => {
    expect(resolveIntegrationSlug('store.myshopline.com', 'other.myshopline.com')).toBe(
      'store.myshopline.com',
    )
  })

  it('falls back to a stamped DOM attr', () => {
    expect(resolveIntegrationSlug(undefined, 'store.myshopline.com')).toBe('store.myshopline.com')
  })

  it('does not fall back to location.hostname — empty when unset', () => {
    expect(resolveIntegrationSlug(undefined, undefined)).toBe('')
    expect(resolveIntegrationSlug('', '')).toBe('')
  })
})

describe('parseCurrency', () => {
  it('accepts ISO 4217 and lowercases', () => {
    expect(parseCurrency('USD')).toBe('usd')
    expect(parseCurrency(' eur ')).toBe('eur')
  })

  it('rejects missing or invalid codes', () => {
    expect(parseCurrency('')).toBeUndefined()
    expect(parseCurrency('US')).toBeUndefined()
    expect(parseCurrency('dollar')).toBeUndefined()
  })
})

describe('widgetSdkUrl', () => {
  it('pins the CLI UMD on QA handles', () => {
    expect(widgetSdkUrl('gs-dev-shop.myshopline.com')).toBe(PINNED_WIDGET_SDK_URL)
  })

  it('uses latest on merchant handles', () => {
    expect(widgetSdkUrl('bags-dev.myshopline.com')).toBe(LATEST_WIDGET_SDK_URL)
  })
})
