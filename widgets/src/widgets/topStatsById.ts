import { Widget } from '@/widgets/base'
import type { WidgetConfig } from '@/widgets/base'
import type { TopStatsWidgetByIdParams } from '@/interfaces'

export class TopStatsWidgetById extends Widget implements TopStatsWidgetByIdParams {
  widgetId: string
  version?: 'v2'

  constructor(params: WidgetConfig & TopStatsWidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.version = params.version
  }

  private get requestBody(): TopStatsWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      version: this.version,
    }
  }

  private updateDefaults({
    widgetId,
    version,
  }: Partial<TopStatsWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.version = version ?? this.version
  }

  async render(options?: Partial<TopStatsWidgetByIdParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<TopStatsWidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    const response = await this.api.fetchTopStatsWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<TopStatsWidgetByIdParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
