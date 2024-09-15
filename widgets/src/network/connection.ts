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
  PerOrderRequestBodyV2,
  ByPercentageRequestBodyV2,
  TieredSpendLevelRequestBodyV2,
  PerProductRequestBodyV2,
  SpendLevelRequestBodyV2,
  CartWidgetRequestBodyV2,
  PerPurchaseWidgetParams,
  PerPurchaseRequestBodyV2,
  WidgetParams,
} from '@/interfaces'
import type { AxiosInstance, AxiosResponse } from 'axios'

export class ConnectionHandler {
  apiKey: string
  integrationSlug?: string
  api: AxiosInstance
  locale: (typeof AVAILABLE_LOCALES)[number]

  constructor({
    apiKey,
    integrationSlug,
    locale = 'en',
  }: {
    apiKey: string
    integrationSlug?: string
    locale: (typeof AVAILABLE_LOCALES)[number]
  }) {
    this.apiKey = apiKey
    this.integrationSlug = integrationSlug
    this.locale = locale
    this.api = axios.create({
      baseURL: process.env.API_URL,
      timeout: 10000,
    })

    this.api.defaults.headers.common['x-api-key'] = this.apiKey
  }

  async fetchCartWidget(
    { version, ...body }: CartWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    if (version) {
      return this.api.post<string, AxiosResponse<string>, CartWidgetRequestBodyV2>(
        `${version}/widgets/cart-widget`,
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
    return this.api.post<string, AxiosResponse<string>, CartWidgetRequestBody>(
      `/widgets/cart-widget`,
      Object.assign(
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
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    if (version) {
      return this.api.post<string, AxiosResponse<string>, SpendLevelRequestBodyV2>(
        `${version}/widgets/spend-level-widget`,
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
    return this.api.post<string, AxiosResponse<string>, SpendLevelRequestBody>(
      `/widgets/spend-level-widget`,
      Object.assign(
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
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    if (version) {
      return this.api.post<string, AxiosResponse<string>, PerOrderRequestBodyV2>(
        `${version}/widgets/per-order-widget`,
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
    return this.api.post<string, AxiosResponse<string>, PerOrderRequestBody>(
      `/widgets/per-order-widget`,
      Object.assign(
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

  async fetchPerPurchaseWidget(
    { version, ...body }: PerPurchaseWidgetParams & Required<WidgetParams>,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, PerPurchaseRequestBodyV2>(
      `${version}/widgets/per-purchase-widget`,
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
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    if (version) {
      return this.api.post<string, AxiosResponse<string>, ByPercentageRequestBodyV2>(
        `${version}/widgets/by-percentage-widget`,
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
    return this.api.post<string, AxiosResponse<string>, ByPercentageRequestBody>(
      `/widgets/by-percentage-widget`,
      Object.assign(
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
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    if (version) {
      return this.api.post<string, AxiosResponse<string>, TieredSpendLevelRequestBodyV2>(
        `${version}/widgets/tiered-spend-level-widget`,
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
    return this.api.post<string, AxiosResponse<string>, TieredSpendLevelRequestBody>(
      `/widgets/tiered-spend-level-widget`,
      Object.assign(
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
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    if (version) {
      return this.api.post<string, AxiosResponse<string>, PerProductRequestBodyV2>(
        `${version}/widgets/per-product-widget`,
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
    return this.api.post<string, AxiosResponse<string>, PerProductRequestBody>(
      `/widgets/per-product-widget`,
      Object.assign(
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
    { version, ...body }: FullWidthBannerWidgetParams,
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
