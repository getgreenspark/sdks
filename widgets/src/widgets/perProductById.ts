import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { PerProductWidgetByIdParams } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class PerProductWidgetById extends Widget implements PerProductWidgetByIdParams {
  widgetId: string
  productId?: string
  version?: 'v2'

  constructor(params: WidgetConfig & PerProductWidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.productId = params.productId
    this.version = params.version
  }

  private get requestBody(): PerProductWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      productId: this.productId,
      version: this.version,
    }
  }

  async render(
    options?: Partial<PerProductWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<PerProductWidgetByIdParams>): Promise<string | undefined> {
    if (options) this.updateDefaults(options)
    if (!this.validateOptions()) return undefined
    const response = await this.api.fetchPerProductWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<PerProductWidgetByIdParams>): Promise<HTMLElement | undefined> {
    const html = await this.renderToString(options)
    if (html) return this.parseHtml(html)
  }

  private updateDefaults({ widgetId, productId, version }: Partial<PerProductWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.productId = productId ?? this.productId
    this.version = version ?? this.version
  }

  private validateOptions(): boolean {
    return WidgetValidator.for('Per Product Widget')
      .widgetId(this.widgetId)
      .productId(this.productId)
      .validate()
  }
}
