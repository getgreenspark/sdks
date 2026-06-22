import type {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from 'axios'
import axios from 'axios'
import { widgetHtmlCache } from '@/utils/cache'
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
  CustomerCartContributionWidgetParams,
  CustomerCartContributionWidgetRequestBody,
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

interface WidgetHttpError extends Error {
  response: AxiosResponse<string>
}

interface SyntheticRequestConfig {
  url: string
  method: 'post'
  params: { lng: string }
  baseURL?: string
  headers: RawAxiosRequestHeaders
}

function createSyntheticResponse(
  data: string,
  status = 200,
  statusText = 'OK',
  requestConfig?: SyntheticRequestConfig,
): AxiosResponse<string> {
  return {
    data,
    status,
    statusText,
    headers: {},
    config: {
      url: requestConfig?.url,
      method: requestConfig?.method ?? 'post',
      params: requestConfig?.params,
      baseURL: requestConfig?.baseURL,
      headers: requestConfig?.headers ?? ({} as AxiosRequestHeaders),
    } as InternalAxiosRequestConfig,
  }
}

function createSuppressedUnauthorizedError(status: number): WidgetHttpError {
  const error = new Error(`Greenspark widget request suppressed after ${status}`)
  return Object.assign(error, {
    response: createSyntheticResponse('', status, status === 401 ? 'Unauthorized' : 'Forbidden'),
  })
}

function getHttpStatus(error: unknown): number | undefined {
  const maybeError = error as { response?: { status?: unknown } }
  return typeof maybeError.response?.status === 'number' ? maybeError.response.status : undefined
}

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
                apiUrl,
              }: {
    apiKey?: string
    integrationSlug?: string
    locale: string
    isShopifyIntegration?: boolean
    origin?: string
    apiUrl?: string
  }) {
    this.apiKey = apiKey
    this.integrationSlug = integrationSlug
    this.locale = locale
    this.api = axios.create({
      baseURL: apiUrl || process.env.API_URL,
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

  private async postWidgetHtml<TBody extends object>(
    endpoint: string,
    body: TBody,
    cacheKey: object,
    headers?: RawAxiosRequestHeaders,
    skipCache = false,
  ): Promise<AxiosResponse<string>> {
    const integrationContext = this.integrationSlug || this.origin || this.apiKey || ''
    const key = {
      ...cacheKey,
      _endpoint: endpoint,
      _locale: this.locale,
      _integrationContext: integrationContext,
    }

    const requestHeaders: RawAxiosRequestHeaders = {
      ...headers,
      accept: 'text/html',
      'content-type': 'application/json',
    }

    const requestConfig: SyntheticRequestConfig = {
      url: endpoint,
      method: 'post',
      params: { lng: this.locale },
      baseURL: this.api.defaults.baseURL,
      headers: requestHeaders,
    }

    if (!skipCache) {
      const unauthorizedStatus = widgetHtmlCache.getUnauthorizedStatus(key)
      if (unauthorizedStatus !== null) {
        throw createSuppressedUnauthorizedError(unauthorizedStatus)
      }

      const cachedResponse = widgetHtmlCache.get(key)
      if (cachedResponse !== null) {
        return createSyntheticResponse(cachedResponse, 200, 'OK', requestConfig)
      }
    }

    const response = await this.api
      .post<string, AxiosResponse<string>, TBody>(endpoint, body, {
        params: requestConfig.params,
        headers: requestHeaders,
      })
      .catch((error: unknown) => {
        const status = getHttpStatus(error)
        if (!skipCache && (status === 401 || status === 403)) {
          widgetHtmlCache.setUnauthorizedStatus(key, status)
        }

        return Promise.reject(error)
      })

    if (!skipCache) {
      widgetHtmlCache.set(key, response.data)
    }

    return response
  }

  async fetchCartWidget(
    { version, ...body }: CartWidgetParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<string> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version

    // Build the complete request params for cache key
    const requestParams = version
      ? Object.assign(
        {},
        body,
        this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
      )
      : Object.assign(
        {},
        body,
        this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
      )

    // Include version in cache params
    const cacheParams = {
      ...requestParams,
      version,
    }

    const endpoint = `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/cart-widget`
    const response = await this.postWidgetHtml<CartWidgetRequestBody>(
      endpoint,
      requestParams,
      cacheParams,
      headers,
      Boolean(isPreview),
    )

    return response.data
  }

  async fetchCartWidgetById(
    { version, ...body }: CartWidgetByIdParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<string> {
    // Build the complete request params for cache key
    const requestParams = { integrationSlug: this.integrationSlug || '', ...body }
    const cacheParams = {
      ...requestParams,
      version,
    }

    const response = await this.postWidgetHtml<CartWidgetByIdRequestBody>(
      `/${version}/widgets/cart-widget/${body.widgetId}`,
      requestParams,
      cacheParams,
      headers,
    )

    return response.data
  }

  async fetchCustomerCartContributionWidget(
    { version, ...body }: CustomerCartContributionWidgetParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<string> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    const payload = isPreview ? { ...body, isCustomerContributionEnabled: true } : body

    // Build the complete request params for cache key
    const requestParams = version
      ? Object.assign(
        {},
        payload,
        this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
      )
      : Object.assign(
        {},
        payload,
        this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
      )

    const cacheParams = {
      ...requestParams,
      version,
    }

    const endpoint = `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/cart-widget`
    const response = await this.postWidgetHtml<CustomerCartContributionWidgetRequestBody>(
      endpoint,
      requestParams,
      cacheParams,
      headers,
      Boolean(isPreview),
    )

    return response.data
  }

  async fetchSpendLevelWidget(
    { version, ...body }: SpendLevelWidgetParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    const requestBody = version
      ? Object.assign(
        {},
        body,
        this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
      )
      : Object.assign(
        {},
        body,
        this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
      )

    return this.postWidgetHtml<SpendLevelRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/spend-level-widget`,
      requestBody,
      requestBody,
      headers,
      Boolean(isPreview),
    )
  }

  async fetchSpendLevelWidgetById(
    { version, ...body }: SpendLevelWidgetByIdParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const requestBody = { integrationSlug: this.integrationSlug || '', ...body }
    return this.postWidgetHtml<SpendLevelWidgetByIdRequestBody>(
      `/${version}/widgets/spend-level-widget/${body.widgetId}`,
      requestBody,
      { ...requestBody, version },
      headers,
    )
  }

  async fetchPerOrderWidget(
    { version, ...body }: PerOrderWidgetParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    const requestBody = version
      ? Object.assign(
        {},
        body,
        this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
      )
      : Object.assign(
        {},
        body,
        this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
      )

    return this.postWidgetHtml<PerOrderRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/per-order-widget`,
      requestBody,
      requestBody,
      headers,
      Boolean(isPreview),
    )
  }

  async fetchPerOrderWidgetById(
    { version, ...body }: PerOrderWidgetByIdParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const requestBody = { integrationSlug: this.integrationSlug || '', ...body }
    return this.postWidgetHtml<PerOrderByIdRequestBody>(
      `/${version}/widgets/per-order-widget/${body.widgetId}`,
      requestBody,
      { ...requestBody, version },
      headers,
    )
  }

  async fetchPerPurchaseWidget(
    { version, ...body }: PerPurchaseWidgetParams & Required<WidgetParams>,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    const requestBody = Object.assign(
      {},
      body,
      this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
    )

    return this.postWidgetHtml<PerPurchaseRequestBody>(
      `${version}/${isPreview ? `preview` : 'widgets'}/per-purchase-widget`,
      requestBody,
      requestBody,
      headers,
      Boolean(isPreview),
    )
  }

  async fetchByPercentageWidget(
    { version, ...body }: ByPercentageWidgetParams,
    headers?: RawAxiosRequestHeaders,
    isPreview?: boolean,
  ): Promise<AxiosResponse<string>> {
    isPreview =
      isPreview === undefined
        ? Boolean(this.integrationSlug === 'GS_PREVIEW' && version)
        : isPreview
    const requestBody = version
      ? Object.assign(
        {},
        body,
        this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
      )
      : Object.assign(
        {},
        body,
        this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
      )

    return this.postWidgetHtml<ByPercentageRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/by-percentage-widget`,
      requestBody,
      requestBody,
      headers,
      isPreview,
    )
  }

  async fetchByPercentageWidgetById(
    { version, ...body }: ByPercentageWidgetByIdParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const requestBody = { integrationSlug: this.integrationSlug || '', ...body }
    return this.postWidgetHtml<ByPercentageWidgetByIdRequestBody>(
      `/${version}/widgets/by-percentage-widget/${body.widgetId}`,
      requestBody,
      { ...requestBody, version },
      headers,
    )
  }

  async fetchByPercentageOfRevenueWidget(
    { version, ...body }: ByPercentageOfRevenueWidgetParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    const requestBody = version
      ? Object.assign(
        {},
        body,
        this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
      )
      : Object.assign(
        {},
        body,
        this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
      )

    return this.postWidgetHtml<ByPercentageOfRevenueRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/by-percentage-of-revenue-widget`,
      requestBody,
      requestBody,
      headers,
      Boolean(isPreview),
    )
  }

  async fetchByPercentageOfRevenueWidgetById(
    { version, ...body }: ByPercentageOfRevenueWidgetByIdParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const requestBody = { integrationSlug: this.integrationSlug || '', ...body }
    return this.postWidgetHtml<ByPercentageOfRevenueWidgetByIdRequestBody>(
      `/${version}/widgets/by-percentage-of-revenue-widget/${body.widgetId}`,
      requestBody,
      { ...requestBody, version },
      headers,
    )
  }

  async fetchTieredSpendLevelWidget(
    { version, ...body }: TieredSpendLevelWidgetParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    const requestBody = version
      ? Object.assign(
        {},
        body,
        this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
      )
      : Object.assign(
        {},
        body,
        this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
      )

    return this.postWidgetHtml<TieredSpendLevelRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/tiered-spend-level-widget`,
      requestBody,
      requestBody,
      headers,
      Boolean(isPreview),
    )
  }

  async fetchTieredSpendLevelWidgetById(
    { version, ...body }: TieredSpendLevelWidgetByIdParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const requestBody = { integrationSlug: this.integrationSlug || '', ...body }
    return this.postWidgetHtml<TieredSpendLevelByIdRequestBody>(
      `/${version}/widgets/tiered-spend-level-widget/${body.widgetId}`,
      requestBody,
      { ...requestBody, version },
      headers,
    )
  }

  async fetchPerProductWidget(
    { version, ...body }: PerProductWidgetParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    const requestBody = version
      ? Object.assign(
        {},
        body,
        this.integrationSlug ? { integrationSlug: this.integrationSlug } : null,
      )
      : Object.assign(
        {},
        body,
        this.integrationSlug ? { shopUniqueName: this.integrationSlug } : null,
      )

    return this.postWidgetHtml<PerProductRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/per-product-widget`,
      requestBody,
      requestBody,
      headers,
      Boolean(isPreview),
    )
  }

  async fetchPerProductWidgetById(
    { version, ...body }: PerProductWidgetByIdParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const requestBody = { integrationSlug: this.integrationSlug || '', ...body }
    return this.postWidgetHtml<PerProductByIdRequestBody>(
      `/${version}/widgets/per-product-widget/${body.widgetId}`,
      requestBody,
      { ...requestBody, version },
      headers,
    )
  }

  async fetchTopStatsWidget(
    { version, ...body }: TopStatsWidgetParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.postWidgetHtml<TopStatsRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/stats-widget`,
      body,
      { ...body, version },
      headers,
      Boolean(isPreview),
    )
  }

  async fetchTopStatsWidgetById(
    { version, ...body }: TopStatsWidgetByIdParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.postWidgetHtml<TopStatsWidgetByIdParams>(
      `/${version}/widgets/stats-widget/${body.widgetId}`,
      { ...body },
      { ...body, version },
      headers,
    )
  }

  async fetchStaticWidget(
    { version, ...body }: StaticWidgetParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.postWidgetHtml<StaticWidgetParams>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/static-widget`,
      body,
      { ...body, version },
      headers,
      Boolean(isPreview),
    )
  }

  async fetchStaticWidgetById(
    { version, ...body }: StaticWidgetByIdParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.postWidgetHtml<StaticWidgetByIdParams>(
      `/${version}/widgets/static-widget/${body.widgetId}`,
      { ...body },
      { ...body, version },
      headers,
    )
  }

  async fetchFullWidthBannerWidget(
    { version, ...body }: FullWidthBannerWidgetParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    const isPreview = this.integrationSlug === 'GS_PREVIEW' && version
    return this.postWidgetHtml<FullWidthBannerRequestBody>(
      `${version ? `/${version}` : ''}/${isPreview ? `preview` : 'widgets'}/full-width-banner`,
      body,
      { ...body, version },
      headers,
      Boolean(isPreview),
    )
  }

  async fetchFullWidthBannerWidgetById(
    { version, ...body }: FullWidthBannerWidgetByIdParams,
    headers?: RawAxiosRequestHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.postWidgetHtml<FullWidthBannerWidgetByIdParams>(
      `/${version}/widgets/full-width-banner/${body.widgetId}`,
      { ...body },
      { ...body, version },
      headers,
    )
  }
}
