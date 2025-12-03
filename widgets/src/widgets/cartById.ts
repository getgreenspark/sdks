import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { CartWidgetByIdParams, StoreOrder } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class CartWidgetById extends Widget implements CartWidgetByIdParams {
  widgetId: string
  order: StoreOrder
  version?: 'v2'

  constructor(params: WidgetConfig & CartWidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.order = params.order
    this.version = params.version
  }

  private get requestBody(): CartWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      order: this.order,
      version: this.version,
    }
  }

  async render(options?: Partial<CartWidgetByIdParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<CartWidgetByIdParams>): Promise<string | undefined> {
    if (options) this.updateDefaults(options)
    if (this.order.lineItems?.length === 0) return
    this.validateOptions()
    return await this.api.fetchCartWidgetById(this.requestBody)
  }

  async renderToElement(options?: Partial<CartWidgetByIdParams>): Promise<HTMLElement | undefined> {
    const html = await this.renderToString(options)
    if (html) return this.parseHtml(html)
  }

  private updateDefaults({ widgetId, order, version }: Partial<CartWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.order = order ?? this.order
    this.version = version ?? this.version
  }

  private validateOptions() {
    return WidgetValidator.for('Cart Widget')
      .widgetId(this.widgetId)
      .order(this.order)
      .validate()
  }
}
