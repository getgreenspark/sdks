import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  isGsDevStore,
  parseCurrency,
  resolveIntegrationSlug,
  widgetSdkUrl,
  PINNED_WIDGET_SDK_URL,
  LATEST_WIDGET_SDK_URL,
} from './config'

describe('isGsDevStore', () => {
  it('treats a hyphen-delimited gs-dev handle as QA', () => {
    assert.equal(isGsDevStore('gs-dev-shop.myshopline.com'), true)
  })

  it('treats greenspark-dev as QA', () => {
    assert.equal(isGsDevStore('merchant-greenspark-dev.myshopline.com'), true)
  })

  it('does not treat bags-dev as QA (substring gs-dev in bags-dev)', () => {
    assert.equal(isGsDevStore('bags-dev.myshopline.com'), false)
  })

  it('does not treat a custom domain hostname as QA', () => {
    assert.equal(isGsDevStore('www.example.com'), false)
  })
})

describe('resolveIntegrationSlug', () => {
  it('prefers the script attribute', () => {
    assert.equal(
      resolveIntegrationSlug('store.myshopline.com', 'other.myshopline.com'),
      'store.myshopline.com',
    )
  })

  it('falls back to a stamped DOM attr', () => {
    assert.equal(resolveIntegrationSlug(undefined, 'store.myshopline.com'), 'store.myshopline.com')
  })

  it('does not fall back to location.hostname — empty when unset', () => {
    assert.equal(resolveIntegrationSlug(undefined, undefined), '')
    assert.equal(resolveIntegrationSlug('', ''), '')
  })
})

describe('parseCurrency', () => {
  it('accepts ISO 4217 and lowercases', () => {
    assert.equal(parseCurrency('USD'), 'usd')
    assert.equal(parseCurrency(' eur '), 'eur')
  })

  it('rejects missing or invalid codes', () => {
    assert.equal(parseCurrency(''), undefined)
    assert.equal(parseCurrency('US'), undefined)
    assert.equal(parseCurrency('dollar'), undefined)
  })
})

describe('widgetSdkUrl', () => {
  it('pins the CLI UMD on QA handles', () => {
    assert.equal(widgetSdkUrl('gs-dev-shop.myshopline.com'), PINNED_WIDGET_SDK_URL)
  })

  it('uses latest on merchant handles', () => {
    assert.equal(widgetSdkUrl('bags-dev.myshopline.com'), LATEST_WIDGET_SDK_URL)
  })
})
