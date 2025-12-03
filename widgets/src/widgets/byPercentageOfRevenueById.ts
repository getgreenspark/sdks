import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { ByPercentageOfRevenueWidgetByIdParams } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class ByPercentageOfRevenueWidgetById
  extends Widget
  implements ByPercentageOfRevenueWidgetByIdParams {
  widgetId: string
  version?: 'v2'

  constructor(params: WidgetConfig & ByPercentageOfRevenueWidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.version = params.version
  }

  private get requestBody(): ByPercentageOfRevenueWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      version: this.version,
    }
  }

  async render(
    options?: Partial<ByPercentageOfRevenueWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<ByPercentageOfRevenueWidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchByPercentageOfRevenueWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(
    options?: Partial<ByPercentageOfRevenueWidgetByIdParams>,
  ): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }

  private updateDefaults({ widgetId, version }: Partial<ByPercentageOfRevenueWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.version = version ?? this.version
  }

  private validateOptions() {
    return WidgetValidator.for('By Percentage Of Revenue Widget').widgetId(this.widgetId).validate()
  }
}
