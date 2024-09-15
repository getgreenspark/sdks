import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/constants'
import { ConnectionHandler } from '@/network'

import type { ApiSettings } from '@/interfaces'

type ValidLanguage = (typeof AVAILABLE_LOCALES)[number]
export class ApiConsumer {
  apiKey: string
  integrationSlug?: string
  currentLocale: ValidLanguage
  api: ConnectionHandler

  constructor({ apiKey, locale = DEFAULT_LOCALE, integrationSlug }: ApiSettings) {
    this.apiKey = apiKey
    this.currentLocale = this.validateLocale(locale)
    this.integrationSlug = integrationSlug
    this.api = this.instanciateApi()
  }

  instanciateApi(): ConnectionHandler {
    return new ConnectionHandler({
      apiKey: this.apiKey,
      integrationSlug: this.integrationSlug,
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

  get locale(): ValidLanguage {
    return this.currentLocale
  }

  set locale(newLocale: ValidLanguage) {
    this.currentLocale = this.validateLocale(newLocale)
    this.api = this.instanciateApi()
  }
}
