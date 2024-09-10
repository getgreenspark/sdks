import axios from 'axios'

import type { AxiosHeaders } from 'axios'
import type { AVAILABLE_LOCALES } from '@/constants'
import type {
  CartWidgetRequestBody,
  CartWidgetParams,
  SpendLevelWidgetParams,
  SpendLevelRequestBody,
  PerOrderWidgetParams,
  PerOrderRequestBody,
  ByPercentageWidgetParams,
  ByPercentageRequestBody,
  TieredSpendLevelWidgetParams,
  TieredSpendLevelRequestBody,
  PerProductWidgetParams,
  PerProductRequestBody,
  TopStatsWidgetParams,
  TopStatsRequestBody,
  FullWidthBannerWidgetParams,
  FullWidthBannerRequestBody,
} from '@/interfaces'
import type { AxiosInstance, AxiosResponse } from 'axios'

export class ConnectionHandler {
  apiKey: string
  shopUniqueName?: string
  api: AxiosInstance
  locale: (typeof AVAILABLE_LOCALES)[number]

  constructor({
    apiKey,
    shopUniqueName,
    locale = 'en',
  }: {
    apiKey: string
    shopUniqueName?: string
    locale: (typeof AVAILABLE_LOCALES)[number]
  }) {
    this.apiKey = apiKey
    this.shopUniqueName = shopUniqueName
    this.locale = locale
    this.api = axios.create({
      baseURL: process.env.API_URL,
      timeout: 10000,
    })

    this.api.defaults.headers.common['x-api-key'] = this.apiKey
  }

  async fetchCartWidget(
    { version, ...body}: CartWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, CartWidgetRequestBody>(
      `${version ? `/${version}` : ''}/widgets/cart-widget`,
      Object.assign({}, body, this.shopUniqueName ? { shopUniqueName: this.shopUniqueName } : null),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchSpendLevelWidget(
    { version, ...body}: SpendLevelWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, SpendLevelRequestBody>(
      `${version ? `/${version}` : ''}/widgets/spend-level-widget`,
      Object.assign({}, body, this.shopUniqueName ? { shopUniqueName: this.shopUniqueName } : null),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchPerOrderWidget(
    { version, ...body}: PerOrderWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, PerOrderRequestBody>(
      `${version ? `/${version}` : ''}/widgets/per-order-widget`,
      Object.assign({}, body, this.shopUniqueName ? { shopUniqueName: this.shopUniqueName } : null),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchByPercentageWidget(
    { version, ...body}: ByPercentageWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, ByPercentageRequestBody>(
      `${version ? `/${version}` : ''}/widgets/by-percentage-widget`,
      Object.assign({}, body, this.shopUniqueName ? { shopUniqueName: this.shopUniqueName } : null),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchTieredSpendLevelWidget(
    { version, ...body}: TieredSpendLevelWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, TieredSpendLevelRequestBody>(
      `${version ? `/${version}` : ''}/widgets/tiered-spend-level-widget`,
      Object.assign({}, body, this.shopUniqueName ? { shopUniqueName: this.shopUniqueName } : null),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchPerProductWidget(
    { version, ...body}: PerProductWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, PerProductRequestBody>(
      `${version ? `/${version}` : ''}/widgets/per-product-widget`,
      Object.assign({}, body, this.shopUniqueName ? { shopUniqueName: this.shopUniqueName } : null),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchTopStatsWidget(
    { version, ...body}: TopStatsWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, TopStatsRequestBody>(
      `${version ? `/${version}` : ''}/widgets/stats-widget`,
      body,
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchFullWidthBannerWidget(
    { version, ...body}: FullWidthBannerWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, FullWidthBannerRequestBody>(
      `${version ? `/${version}` : ''}/widgets/full-width-banner`,
      body,
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }
}
