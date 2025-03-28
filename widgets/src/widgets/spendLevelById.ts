import { Widget } from '@/widgets/base'
import type { WidgetConfig } from '@/widgets/base'
import type { SpendLevelWidgetByIdParams } from '@/interfaces'

export class SpendLevelWidgetById extends Widget implements SpendLevelWidgetByIdParams {
  widgetId: string
  currency: string
  version?: 'v2'

  constructor(params: WidgetConfig & SpendLevelWidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.currency = params.currency
    this.version = params.version
  }

  private get requestBody(): SpendLevelWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      currency: this.currency,
      version: this.version,
    }
  }

  private updateDefaults({ widgetId, currency, version }: Partial<SpendLevelWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.currency = currency ?? this.currency
    this.version = version ?? this.version
  }

  private validateOptions() {
    if (!(typeof this.currency === 'string')) {
      throw new Error(
        `Greenspark - "${this.currency}" was selected as the widget's currency for the Spend Level Widget, but this currency is not available. Please use a valid currency code like "USD", "GBP" and "EUR".`,
      )
    }
  }

  async render(
    options?: Partial<SpendLevelWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<SpendLevelWidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchSpendLevelWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<SpendLevelWidgetByIdParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
