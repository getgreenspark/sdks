import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { FullWidthBannerWidgetByIdParams } from '@/interfaces'

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
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<FullWidthBannerWidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    const response = await this.api.fetchFullWidthBannerWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<FullWidthBannerWidgetByIdParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }

  private updateDefaults({
                           widgetId,
                           version,
                         }: Partial<FullWidthBannerWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.version = version ?? this.version
  }
}
