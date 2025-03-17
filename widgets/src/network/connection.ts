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
  ByPercentageOfRevenueWidgetParams,
  ByPercentageRequestBody,
  TieredSpendLevelWidgetParams,
  TieredSpendLevelRequestBody,
  PerProductWidgetParams,
  PerProductRequestBody,
  TopStatsWidgetParams,
  TopStatsRequestBody,
  FullWidthBannerWidgetParams,
  FullWidthBannerRequestBody,
  PerPurchaseWidgetParams,
  PerPurchaseRequestBody,
  WidgetParams,
  StaticWidgetParams,
  PerOrderByIdWidgetParams,
  PerOrderByIdRequestBody,
} from '@/interfaces'
import type { AxiosInstance, AxiosResponse } from 'axios'

export class ConnectionHandler {
  apiKey?: string
  integrationSlug?: string
  api: AxiosInstance
  locale: (typeof AVAILABLE_LOCALES)[number]

  constructor({
    apiKey,
    integrationSlug,
    locale = 'en',
    isShopifyIntegration = false,
  }: {
    apiKey?: string
    integrationSlug?: string
    locale: (typeof AVAILABLE_LOCALES)[number]
    isShopifyIntegration?: boolean
  }) {
    this.apiKey = apiKey
    this.integrationSlug = integrationSlug
    this.locale = locale
    this.api = axios.create({
      baseURL: process.env.API_URL,
      timeout: 10000,
    })

    if (isShopifyIntegration) {
      this.api.defaults.headers.common['x-integration-slug'] = this.integrationSlug
    } else {
      this.api.defaults.headers.common['x-api-key'] = this.apiKey
    }
  }

  async fetchCartWidget(
    { version, ...body }: CartWidgetParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.api.post<string, AxiosResponse<string>, CartWidgetRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/cart-widget`,
      version
        ? Object.assign(
            {},
            body,
            this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
          )
        : Object.assign(
            {},
            body,
            this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
          ),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchSpendLevelWidget(
    { version, ...body }: SpendLevelWidgetParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.api.post<string, AxiosResponse<string>, SpendLevelRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/spend-level-widget`,
      version
        ? Object.assign(
            {},
            body,
            this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
          )
        : Object.assign(
            {},
            body,
            this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
          ),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchPerOrderWidget(
    { version, ...body }: PerOrderWidgetParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.api.post<string, AxiosResponse<string>, PerOrderRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/per-order-widget`,
      version
        ? Object.assign(
            {},
            body,
            this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
          )
        : Object.assign(
            {},
            body,
            this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
          ),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchWidgetById(
    { version = 'v2', ...body }: PerOrderByIdWidgetParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, PerOrderByIdRequestBody>(
      `${version}/widgets/per-order-widget`,
      {
        ...body,
        integrationSlug: this.integrationSlug || '',
      },
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchPerPurchaseWidget(
    { version, ...body }: PerPurchaseWidgetParams & Required<WidgetParams>,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.api.post<string, AxiosResponse<string>, PerPurchaseRequestBody>(
      `${version}/${isPreview ? `preview` : 'widgets'}/per-purchase-widget`,
      Object.assign(
        {},
        body,
        this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
      ),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchByPercentageWidget(
    { version, ...body }: ByPercentageWidgetParams,
    headers?: typeof AxiosHeaders,
    isPreview?: boolean,
  ): Promise<AxiosResponse<string>> {
    isPreview =
      isPreview === undefined
        ? Boolean(this.integrationSlug === 'GS_PREVIEW' && version)
        : isPreview
    return this.api.post<string, AxiosResponse<string>, ByPercentageRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/by-percentage-widget`,
      version
        ? Object.assign(
            {},
            body,
            this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
          )
        : Object.assign(
            {},
            body,
            this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
          ),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchByPercentageOfRevenueWidget(
    { version, ...body }: ByPercentageOfRevenueWidgetParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.api.post<string, AxiosResponse<string>, ByPercentageRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/by-percentage-of-revenue-widget`,
      version
        ? Object.assign(
            {},
            body,
            this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
          )
        : Object.assign(
            {},
            body,
            this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
          ),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchTieredSpendLevelWidget(
    { version, ...body }: TieredSpendLevelWidgetParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.api.post<string, AxiosResponse<string>, TieredSpendLevelRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/tiered-spend-level-widget`,
      version
        ? Object.assign(
            {},
            body,
            this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
          )
        : Object.assign(
            {},
            body,
            this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
          ),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchPerProductWidget(
    { version, ...body }: PerProductWidgetParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.api.post<string, AxiosResponse<string>, PerProductRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/per-product-widget`,
      version
        ? Object.assign(
            {},
            body,
            this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
          )
        : Object.assign(
            {},
            body,
            this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
          ),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchTopStatsWidget(
    { version, ...body }: TopStatsWidgetParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.api.post<string, AxiosResponse<string>, TopStatsRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/stats-widget`,
      body,
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchStaticWidget(
    { version, ...body }: StaticWidgetParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.api.post<string, AxiosResponse<string>, StaticWidgetParams>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/static-widget`,
      body,
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchFullWidthBannerWidget(
    { version, ...body }: FullWidthBannerWidgetParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.api.post<string, AxiosResponse<string>, FullWidthBannerRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/full-width-banner`,
      body,
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }
}
