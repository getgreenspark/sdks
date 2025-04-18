import type { AxiosHeaders, AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import type {
  ByPercentageOfRevenueRequestBody,
  ByPercentageOfRevenueWidgetByIdParams,
  ByPercentageOfRevenueWidgetByIdRequestBody,
  ByPercentageOfRevenueWidgetParams,
  ByPercentageRequestBody,
  ByPercentageWidgetByIdParams,
  ByPercentageWidgetByIdRequestBody,
  ByPercentageWidgetParams,
  CartWidgetByIdParams,
  CartWidgetByIdRequestBody,
  CartWidgetParams,
  CartWidgetRequestBody,
  FullWidthBannerRequestBody,
  FullWidthBannerWidgetByIdParams,
  FullWidthBannerWidgetParams,
  PerOrderByIdRequestBody,
  PerOrderRequestBody,
  PerOrderWidgetByIdParams,
  PerOrderWidgetParams,
  PerProductByIdRequestBody,
  PerProductRequestBody,
  PerProductWidgetByIdParams,
  PerProductWidgetParams,
  PerPurchaseRequestBody,
  PerPurchaseWidgetParams,
  SpendLevelRequestBody,
  SpendLevelWidgetByIdParams,
  SpendLevelWidgetByIdRequestBody,
  SpendLevelWidgetParams,
  StaticWidgetByIdParams,
  StaticWidgetParams,
  TieredSpendLevelByIdRequestBody,
  TieredSpendLevelRequestBody,
  TieredSpendLevelWidgetByIdParams,
  TieredSpendLevelWidgetParams,
  TopStatsRequestBody,
  TopStatsWidgetByIdParams,
  TopStatsWidgetParams,
  WidgetParams,
} from '@/interfaces'

export class ConnectionHandler {
  apiKey?: string
  integrationSlug?: string
  origin?: string
  api: AxiosInstance
  locale: string

  constructor({
                apiKey,
                integrationSlug,
                locale = 'en',
                isShopifyIntegration = false,
                origin,
              }: {
    apiKey?: string
    integrationSlug?: string
    locale: string
    isShopifyIntegration?: boolean
    origin?: string
  }) {
    this.apiKey = apiKey
    this.integrationSlug = integrationSlug
    this.locale = locale
    this.api = axios.create({
      baseURL: process.env.API_URL,
      timeout: 10000,
    })
    this.origin = origin

    if (isShopifyIntegration) {
      this.api.defaults.headers.common['x-integration-slug'] = this.integrationSlug
    } else if (origin) {
      this.api.defaults.headers.common['x-gs-widget-origin'] = this.origin
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

  async fetchCartWidgetById(
    { version, ...body }: CartWidgetByIdParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, CartWidgetByIdRequestBody>(
      `/${version}/widgets/cart-widget/${body.widgetId}`,
      { integrationSlug: this.integrationSlug || '', ...body },
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

  async fetchSpendLevelWidgetById(
    { version, ...body }: SpendLevelWidgetByIdParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, SpendLevelWidgetByIdRequestBody>(
      `/${version}/widgets/spend-level-widget/${body.widgetId}`,
      { integrationSlug: this.integrationSlug || '', ...body },
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

  async fetchPerOrderWidgetById(
    { version, ...body }: PerOrderWidgetByIdParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, PerOrderByIdRequestBody>(
      `/${version}/widgets/per-order-widget/${body.widgetId}`,
      { integrationSlug: this.integrationSlug || '', ...body },
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

  async fetchByPercentageWidgetById(
    { version, ...body }: ByPercentageWidgetByIdParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, ByPercentageWidgetByIdRequestBody>(
      `/${version}/widgets/by-percentage-widget/${body.widgetId}`,
      { integrationSlug: this.integrationSlug || '', ...body },
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
    return this.api.post<string, AxiosResponse<string>, ByPercentageOfRevenueRequestBody>(
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

  async fetchByPercentageOfRevenueWidgetById(
    { version, ...body }: ByPercentageOfRevenueWidgetByIdParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, ByPercentageOfRevenueWidgetByIdRequestBody>(
      `/${version}/widgets/by-percentage-of-revenue-widget/${body.widgetId}`,
      { integrationSlug: this.integrationSlug || '', ...body },
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

  async fetchTieredSpendLevelWidgetById(
    { version, ...body }: TieredSpendLevelWidgetByIdParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, TieredSpendLevelByIdRequestBody>(
      `/${version}/widgets/tiered-spend-level-widget/${body.widgetId}`,
      { integrationSlug: this.integrationSlug || '', ...body },
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

  async fetchPerProductWidgetById(
    { version, ...body }: PerProductWidgetByIdParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, PerProductByIdRequestBody>(
      `/${version}/widgets/per-product-widget/${body.widgetId}`,
      { integrationSlug: this.integrationSlug || '', ...body },
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

  async fetchTopStatsWidgetById(
    { version, ...body }: TopStatsWidgetByIdParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, TopStatsWidgetByIdParams>(
      `/${version}/widgets/stats-widget/${body.widgetId}`,
      { ...body },
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

  async fetchStaticWidgetById(
    { version, ...body }: StaticWidgetByIdParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, StaticWidgetByIdParams>(
      `/${version}/widgets/static-widget/${body.widgetId}`,
      { ...body },
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

  async fetchFullWidthBannerWidgetById(
    { version, ...body }: FullWidthBannerWidgetByIdParams,
    headers?: typeof AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, FullWidthBannerWidgetByIdParams>(
      `/${version}/widgets/full-width-banner/${body.widgetId}`,
      { ...body },
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }
}
