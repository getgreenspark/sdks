import axios, { AxiosHeaders } from 'axios'

import { AVAILABLE_LOCALES } from '@/constants'

import type { CartWidgetRequestBody, CartWidgetParams } from '@/interfaces'
import type { AxiosInstance, AxiosResponse } from 'axios'

export class ConnectionHandler {
  apiKey: string
  shopUniqueName: string
  api: AxiosInstance
  locale: (typeof AVAILABLE_LOCALES)[number]

  constructor({
    apiKey,
    shopUniqueName,
    locale = 'en',
  }: {
    apiKey: string
    shopUniqueName: string
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
      {
        ...body,
        shopUniqueName: this.shopUniqueName,
      },
      {
        params: { lng: this.locale },
        headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
      },
    )
  }
}
