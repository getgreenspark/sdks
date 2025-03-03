import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/constants'
import { ConnectionHandler } from '@/network'

import type { ApiSettings } from '@/interfaces'

type ValidLanguage = (typeof AVAILABLE_LOCALES)[number]
export class ApiConsumer {
  apiKey?: string
  integrationSlug?: string
  currentLocale: ValidLanguage
  api: ConnectionHandler
  isShopifyIntegration?: boolean

  constructor({
    apiKey,
    locale = DEFAULT_LOCALE,
    integrationSlug,
    shopUniqueName,
    isShopifyIntegration = false,
  }: ApiSettings) {
    this.apiKey = apiKey
    this.currentLocale = this.validateLocale(locale)
    this.integrationSlug = integrationSlug || shopUniqueName
    this.isShopifyIntegration = isShopifyIntegration
    this.api = this.instanciateApi()
  }

  instanciateApi(): ConnectionHandler {
    return new ConnectionHandler({
      apiKey: this.apiKey,
      integrationSlug: this.integrationSlug,
      locale: this.locale,
      isShopifyIntegration: this.isShopifyIntegration,
    })
  }

  validateLocale(language: ValidLanguage): ValidLanguage {
    if (!AVAILABLE_LOCALES.includes(language)) {
      console.warn(`Greenspark - Failed to update locale, because ${language} is not currently supported. The available options are ${AVAILABLE_LOCALES.join(
        ', ',
      )}`)
      return 'en'
    }

    return language
  }

  get locale(): ValidLanguage {
    return this.currentLocale
  }

  set locale(newLocale: ValidLanguage) {
    this.currentLocale = this.validateLocale(newLocale)
    this.api = this.instanciateApi()
  }
}
