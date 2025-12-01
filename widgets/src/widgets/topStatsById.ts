import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { TopStatsWidgetByIdParams } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

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

  async render(options?: Partial<TopStatsWidgetByIdParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<TopStatsWidgetByIdParams>): Promise<string | undefined> {
    if (options) this.updateDefaults(options)
    if (!this.validateOptions()) return undefined
    const response = await this.api.fetchTopStatsWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<TopStatsWidgetByIdParams>): Promise<HTMLElement | undefined> {
    const html = await this.renderToString(options)
    if (html) return this.parseHtml(html)
  }

  private updateDefaults({
                           widgetId,
                           version,
                         }: Partial<TopStatsWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.version = version ?? this.version
  }

  private validateOptions(): boolean {
    return WidgetValidator.for('Top Stats Widget').widgetId(this.widgetId).validate()
  }
}
