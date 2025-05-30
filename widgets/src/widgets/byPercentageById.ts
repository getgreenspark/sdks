import { Widget } from '@/widgets/base'
import type { WidgetConfig } from '@/widgets/base'
import type { ByPercentageWidgetByIdParams } from '@/interfaces'

export class ByPercentageWidgetById extends Widget implements ByPercentageWidgetByIdParams {
  widgetId: string
  version?: 'v2'

  constructor(params: WidgetConfig & ByPercentageWidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.version = params.version
  }

  private get requestBody(): ByPercentageWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      version: this.version,
    }
  }

  private updateDefaults({ widgetId, version }: Partial<ByPercentageWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.version = version ?? this.version
  }

  async render(
    options?: Partial<ByPercentageWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<ByPercentageWidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    const response = await this.api.fetchByPercentageWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<ByPercentageWidgetByIdParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
