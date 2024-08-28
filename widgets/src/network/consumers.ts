import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/constants'
import { ConnectionHandler } from '@/network'

import type { ApiSettings } from '@/interfaces'

type ValidLanguage = (typeof AVAILABLE_LOCALES)[number]
export class ApiConsumer {
  apiKey: string
  shopUniqueName?: string
  currentLocale: ValidLanguage
  api: ConnectionHandler

  constructor({ apiKey, locale = DEFAULT_LOCALE, shopUniqueName }: ApiSettings) {
    this.apiKey = apiKey
    this.currentLocale = this.validateLocale(locale)
    this.shopUniqueName = shopUniqueName
    this.api = this.instanciateApi()
  }

  instanciateApi(): ConnectionHandler {
    return new ConnectionHandler({
      apiKey: this.apiKey,
      shopUniqueName: this.shopUniqueName,
      locale: this.locale,
    })
  }

  validateLocale(newLocale: ValidLanguage): ValidLanguage {
    if (!AVAILABLE_LOCALES.includes(newLocale)) {
      throw new Error(
        `Greenspark - Failed to update locale, because ${newLocale} is not currently supported. The available options are ${AVAILABLE_LOCALES.join(
          ', ',
        )}`,
      )
    }

    return newLocale
  }

  get locale(): (typeof AVAILABLE_LOCALES)[number] {
    return this.currentLocale
  }

  set locale(newLocale: (typeof AVAILABLE_LOCALES)[number]) {
    this.currentLocale = this.validateLocale(newLocale)
    this.api = this.instanciateApi()
  }
}
