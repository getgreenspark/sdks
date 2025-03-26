import { Widget } from '@/widgets/base'
import type { WidgetConfig } from '@/widgets/base'
import type { OrderProduct, StoreOrder, CartWidgetByIdParams } from '@/interfaces'

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

  private updateDefaults({ widgetId, order, version }: Partial<CartWidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.order = order ?? this.order
    this.version = version ?? this.version
  }

  private validateOptions() {
    if (!(typeof this.order.currency === 'string')) {
      throw new Error(
        `Greenspark - "${this.order.currency}" was selected as the cart currency for the Cart Widget, but this currency is not available. Please use a valid currency code like "USD", "GBP" and "EUR".`,
      )
    }

    if (Number.isNaN(Number(this.order.totalPrice)) || this.order.totalPrice < 0) {
      throw new Error(
        `Greenspark - ${this.order.totalPrice} was provided as the order's totalPrice, but this value is not a valid. Please provide a valid number to the Cart Widget.`,
      )
    }

    if (!Array.isArray(this.order.lineItems)) {
      throw new Error(
        `Greenspark - ${this.order.lineItems} was provided as the order's items, but this value is valid. Please provide a valid array of items to the Cart Widget.`,
      )
    }

    const isValidProduct = (p: OrderProduct): boolean => {
      if (!p.productId || typeof p.productId !== 'string') return false
      if (Number.isNaN(Number(p.quantity)) || p.quantity < 0) return false
      return true
    }

    if (!this.order.lineItems.every(isValidProduct)) {
      throw new Error(
        `Greenspark - The values provided to the Cart Widget as 'lineItems' are not valid products with a 'productId'(string) and a 'quantity'(number).`,
      )
    }
  }

  async render(options?: Partial<CartWidgetByIdParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<CartWidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchCartWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<CartWidgetByIdParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
