import { Widget } from '@/widgets/base'
import type { WidgetConfig } from '@/widgets/base'
import type { StaticWidgetByIdParams } from '@/interfaces'

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

  private updateDefaults({ widgetId, version }: Partial<StaticWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.version = version ?? this.version
  }

  async render(
    options?: Partial<StaticWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<StaticWidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    const response = await this.api.fetchStaticWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<StaticWidgetByIdParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
