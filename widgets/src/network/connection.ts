import axios from 'axios'

import type { AxiosHeaders } from 'axios'
import type { AVAILABLE_LOCALES } from '@/constants'
import type {
  CartWidgetRequestBody,
  CartWidgetParams,
  SpendLevelWidgetParams,
  SpendLevelRequestBody,
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
    body: CartWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, CartWidgetRequestBody>(
      '/widgets/cart-widget',
      Object.assign({}, body, this.shopUniqueName ? { shopUniqueName: this.shopUniqueName } : null),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }

  async fetchSpendLevelWidget(
    body: SpendLevelWidgetParams,
    headers?: AxiosHeaders,
  ): Promise<AxiosResponse<string>> {
    return this.api.post<string, AxiosResponse<string>, SpendLevelRequestBody>(
      '/widgets/cart-widget',
      Object.assign({}, body, this.shopUniqueName ? { shopUniqueName: this.shopUniqueName } : null),
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }
}
