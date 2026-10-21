import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { CartWidgetByIdOptions, CartWidgetByIdParams, StoreOrder } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'
import { CustomerChoiceController } from '@/widgets/customerChoice'

export class CartWidgetById extends Widget implements CartWidgetByIdParams {
  widgetId: string
  order: StoreOrder
  version?: 'v2'
  private readonly customerChoice?: CustomerChoiceController
  private renderSequence = 0

  constructor(params: WidgetConfig & CartWidgetByIdOptions) {
    super(params)
    this.widgetId = params.widgetId
    this.order = params.order
    this.version = params.version

    if (params.customerChoice) {
      WidgetValidator.for('Cart Widget').customerChoice(params.customerChoice).validate()
      const { storage, onRedraw } = params.customerChoice
      this.customerChoice = new CustomerChoiceController(storage, {
        redraw: async (projectId) => {
          await this.render({ order: { ...this.order, customerChoiceProjectId: projectId } })
          onRedraw?.()
        },
      })
    }
  }

  private get requestBody(): CartWidgetByIdParams {
    return {
      widgetId: this.widgetId,
      order: this.order,
      version: this.version,
    }
  }

  async render(options?: Partial<CartWidgetByIdParams>, containerSelector?: string): Promise<void> {
    const sequence = ++this.renderSequence
    const node = await this.renderToElement(options)
    // With project choice, the widget redraws itself alongside the platform's renders, so a response
    // that a newer render overtook must not replace it. Without it, rendering is unchanged.
    if (this.customerChoice && sequence !== this.renderSequence) return
    if (!node) return

    this.inject(node, containerSelector)
    if (!this.customerChoice) return

    const container = document.querySelector(this.containerSelector)
    if (container) {
      this.customerChoice.afterRender(this.getWrapper(container), this.order.customerChoiceProjectId)
    }
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
