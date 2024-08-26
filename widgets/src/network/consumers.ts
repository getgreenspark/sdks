import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/constants'
import { ConnectionHandler } from '@/network'

import type { ApiSettings } from '@/interfaces'

export class ApiConsumer {
  apiKey: string
  shopUniqueName?: string
  currentLocale: (typeof AVAILABLE_LOCALES)[number]
  api: ConnectionHandler

  constructor({ apiKey, locale = DEFAULT_LOCALE, shopUniqueName }: ApiSettings) {
    this.apiKey = apiKey
    this.currentLocale = locale
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

  get locale(): (typeof AVAILABLE_LOCALES)[number] {
    return this.currentLocale
  }

  set locale(newLocale: (typeof AVAILABLE_LOCALES)[number]) {
    if (!AVAILABLE_LOCALES.includes(newLocale)) {
      throw new Error(
        `Greenspark - Failed to update locale, because ${newLocale} is not currently supported. The available options are ${AVAILABLE_LOCALES.join(
          ', ',
        )}`,
      )
    }

    this.currentLocale = newLocale
    this.instanciateApi()
  }
}
