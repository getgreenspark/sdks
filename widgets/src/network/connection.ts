import axios, { AxiosHeaders, type AxiosResponse } from 'axios'

import { AVAILABLE_LOCALES } from '@/constants'

import type { CartWidgetAPIParams } from '@/interfaces'

const api = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
})

export const fetchCartWidget = (
  body: CartWidgetAPIParams,
  query: { locale?: (typeof AVAILABLE_LOCALES)[number] } = { locale: 'en' },
  headers: AxiosHeaders,
): Promise<AxiosResponse<string>> => {
  return api.post('/cart-widget', body, {
    params: { lng: query.locale },
    headers: { ...headers, accept: 'text/html', 'content-type': 'application/json' },
  })
}
