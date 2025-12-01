import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { SpendLevelWidgetByIdParams } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

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

  async render(
    options?: Partial<SpendLevelWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<SpendLevelWidgetByIdParams>): Promise<string | undefined> {
    if (options) this.updateDefaults(options)
    if (!this.validateOptions()) return undefined
    const response = await this.api.fetchSpendLevelWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<SpendLevelWidgetByIdParams>): Promise<HTMLElement | undefined> {
    const html = await this.renderToString(options)
    if (html) return this.parseHtml(html)
  }

  private updateDefaults({ widgetId, currency, version }: Partial<SpendLevelWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.currency = currency ?? this.currency
    this.version = version ?? this.version
  }

  private validateOptions(): boolean {
    return WidgetValidator.for('Spend Level Widget')
      .widgetId(this.widgetId)
      .currency(this.currency)
      .validate()
  }
}
