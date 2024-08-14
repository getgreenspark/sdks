import { AVAILABLE_LOCALES } from '@/constants'
import type { ApiSettings } from '@/interfaces'

export class ApiConsumer {
  apiKey: string
  shopUniqueName: string
  currentLocale: (typeof AVAILABLE_LOCALES)[number]

  constructor({ apiKey, locale, shopUniqueName }: ApiSettings) {
    this.apiKey = apiKey
    this.currentLocale = locale
    this.shopUniqueName = shopUniqueName
  }

  get locale(): (typeof AVAILABLE_LOCALES)[number] {
    return this.currentLocale
  }

  set locale(newLocale: (typeof AVAILABLE_LOCALES)[number]) {
    if (!AVAILABLE_LOCALES.includes(newLocale)) {
      throw new Error(
        `Greenspark - Failed to update locale, because ${newLocale} is not currently supported. The available options are ${AVAILABLE_LOCALES.join()}`,
      )
    }

    this.currentLocale = newLocale
  }
}
