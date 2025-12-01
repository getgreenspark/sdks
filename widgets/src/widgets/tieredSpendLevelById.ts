import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { TieredSpendLevelWidgetByIdParams } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class TieredSpendLevelWidgetById extends Widget implements TieredSpendLevelWidgetByIdParams {
  widgetId: string
  currency: string
  version?: 'v2'

  constructor(params: WidgetConfig & TieredSpendLevelWidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.currency = params.currency
    this.version = params.version
  }

  private get requestBody(): TieredSpendLevelWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      currency: this.currency,
      version: this.version,
    }
  }

  async render(
    options?: Partial<TieredSpendLevelWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<TieredSpendLevelWidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchTieredSpendLevelWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<TieredSpendLevelWidgetByIdParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }

  private updateDefaults({
                           widgetId,
                           currency,
                           version,
                         }: Partial<TieredSpendLevelWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.currency = currency ?? this.currency
    this.version = version ?? this.version
  }

  private validateOptions() {
    WidgetValidator.for('Tiered Spend Level Widget')
      .widgetId(this.widgetId)
      .currency(this.currency)
      .validate()
  }
}
