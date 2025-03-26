import { Widget } from '@/widgets/base'
import type { WidgetConfig } from '@/widgets/base'
import type { PerProductWidgetByIdParams } from '@/interfaces'

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

  private updateDefaults({ widgetId, productId, version }: Partial<PerProductWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.productId = productId ?? this.productId
    this.version = version ?? this.version
  }

  private validateOptions() {
    if (!((typeof this.productId === 'string' && this.productId !== '') || !this.productId)) {
      throw new Error(
        `Greenspark - "${this.productId}" was selected as the product for the Per Product Widget, but this product ID is not valid. Please use a valid string.`,
      )
    }
  }

  async render(
    options?: Partial<PerProductWidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<PerProductWidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchPerProductWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<PerProductWidgetByIdParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
