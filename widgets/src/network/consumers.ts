import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/constants'
import { ConnectionHandler } from '@/network'

import type { ApiSettings } from '@/interfaces'

export class ApiConsumer {
  apiKey?: string
  integrationSlug?: string
  currentLocale: string
  api: ConnectionHandler
  isShopifyIntegration?: boolean
  origin?: string

  constructor({
                apiKey,
                locale = DEFAULT_LOCALE,
                integrationSlug,
                shopUniqueName,
                isShopifyIntegration = false,
                origin,
              }: ApiSettings) {
    // eslint-disable-next-line no-console
    console.log('ApiConsumer', origin)
    this.apiKey = apiKey
    this.currentLocale = locale
    this.integrationSlug = integrationSlug || shopUniqueName
    this.isShopifyIntegration = isShopifyIntegration
    this.api = this.instanciateApi()
    this.origin = origin
  }

  get locale(): string {
    return this.currentLocale
  }

  set locale(newLocale: string) {
    this.currentLocale = this.validateLocale(newLocale)
    this.api = this.instanciateApi()
  }

  instanciateApi(): ConnectionHandler {
    // eslint-disable-next-line no-console
    console.log('instanciateApi', this.origin)
    return new ConnectionHandler({
      apiKey: this.apiKey,
      integrationSlug: this.integrationSlug,
      locale: this.locale,
      isShopifyIntegration: this.isShopifyIntegration,
      origin: this.origin,
    })
  }

  validateLocale(language: string): string {
    if (!AVAILABLE_LOCALES.some((locale) => locale === language)) {
      console.warn(
        `Greenspark - Failed to update locale, because ${language} is not currently supported. The available options are ${AVAILABLE_LOCALES.join(
          ', ',
        )}`,
      )
    }

    return language
  }
}
