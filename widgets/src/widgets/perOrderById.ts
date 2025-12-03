import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { PerOrderWidgetByIdParams } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class PerOrderWidgetById extends Widget implements PerOrderWidgetByIdParams {
  widgetId: string
  version?: 'v2'

  constructor(params: WidgetConfig & PerOrderWidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.version = params.version
  }

  private get requestBody(): PerOrderWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      version: this.version,
    }
  }

  async render(
    options?: Partial<PerOrderWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<PerOrderWidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchPerOrderWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<PerOrderWidgetByIdParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }

  private updateDefaults({ widgetId, version }: Partial<PerOrderWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.version = version ?? this.version
  }

  private validateOptions() {
    return WidgetValidator.for('Per Order Widget').widgetId(this.widgetId).validate()
  }
}
