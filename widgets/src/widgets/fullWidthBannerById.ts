import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { FullWidthBannerWidgetByIdParams } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class FullWidthBannerWidgetById extends Widget implements FullWidthBannerWidgetByIdParams {
  widgetId: string
  version?: 'v2'

  constructor(params: WidgetConfig & FullWidthBannerWidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.version = params.version
  }

  private get requestBody(): FullWidthBannerWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      version: this.version,
    }
  }

  async render(
    options?: Partial<FullWidthBannerWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<FullWidthBannerWidgetByIdParams>): Promise<string | undefined> {
    if (options) this.updateDefaults(options)
    if (!this.validateOptions()) return undefined
    const response = await this.api.fetchFullWidthBannerWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<FullWidthBannerWidgetByIdParams>): Promise<HTMLElement | undefined> {
    const html = await this.renderToString(options)
    if (html) return this.parseHtml(html)
  }

  private validateOptions(): boolean {
    return WidgetValidator.for('Full Width Banner Widget').widgetId(this.widgetId).validate()
  }

  private updateDefaults({
                           widgetId,
                           version,
                         }: Partial<FullWidthBannerWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.version = version ?? this.version
  }
}
