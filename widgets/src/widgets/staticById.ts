import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { StaticWidgetByIdParams } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class StaticWidgetById extends Widget implements StaticWidgetByIdParams {
  widgetId: string
  version?: 'v2'

  constructor(params: WidgetConfig & StaticWidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.version = params.version
  }

  private get requestBody(): StaticWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      version: this.version,
    }
  }

  async render(
    options?: Partial<StaticWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<StaticWidgetByIdParams>): Promise<string | undefined> {
    if (options) this.updateDefaults(options)
    if (!this.validateOptions()) return undefined
    const response = await this.api.fetchStaticWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<StaticWidgetByIdParams>): Promise<HTMLElement | undefined> {
    const html = await this.renderToString(options)
    if (html) return this.parseHtml(html)
  }

  private updateDefaults({ widgetId, version }: Partial<StaticWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.version = version ?? this.version
  }

  private validateOptions(): boolean {
    return WidgetValidator.for('Static Widget').widgetId(this.widgetId).validate()
  }
}
