import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type {
  CustomerCartContributionWidgetOptions,
  CustomerCartContributionWidgetParams,
  PopupTheme,
  StoreOrder,
  WidgetColor,
  WidgetStyle,
} from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'
import { CustomerChoiceController } from '@/widgets/customerChoice'

export class CustomerCartContributionWidget
  extends Widget
  implements CustomerCartContributionWidgetParams {
  color: WidgetColor
  order: StoreOrder
  withPopup?: boolean
  popupTheme?: PopupTheme
  style?: WidgetStyle
  version?: 'v2'
  private readonly customerChoice?: CustomerChoiceController
  private renderSequence = 0

  constructor(params: WidgetConfig & CustomerCartContributionWidgetOptions) {
    super(params)
    this.color = params.color
    this.order = params.order
    this.withPopup = params.withPopup ?? true
    this.popupTheme = params.popupTheme
    this.style = params.style ?? 'default'
    this.version = params.version

    if (params.customerChoice) {
      WidgetValidator.for('Customer Cart Contribution Widget')
        .customerChoice(params.customerChoice)
        .validate()
      const { storage, onRedraw } = params.customerChoice
      this.customerChoice = new CustomerChoiceController(storage, {
        redraw: async (projectId) => {
          await this.render({ order: { ...this.order, customerChoiceProjectId: projectId } })
          onRedraw?.()
        },
      })
    }
  }

  private get requestBody(): CustomerCartContributionWidgetParams {
    return {
      color: this.color,
      order: this.order,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      style: this.style,
      version: this.version,
    }
  }

  async render(
    options?: Partial<CustomerCartContributionWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const sequence = ++this.renderSequence
    const node = await this.renderToElement(options)
    // With project choice, the widget redraws itself alongside the platform's renders, so a response
    // that a newer render overtook must not replace it. Without it, rendering is unchanged.
    if (this.customerChoice && sequence !== this.renderSequence) return
    if (!node) return

    this.inject(node, containerSelector)
    const container = document.querySelector(this.containerSelector)
    if (container && this.customerChoice) {
      this.customerChoice.afterRender(this.getWrapper(container), this.order.customerChoiceProjectId)
    }
  }

  async renderToString(options?: Partial<CustomerCartContributionWidgetParams>): Promise<string | undefined> {
    if (options) this.updateDefaults(options)
    if (this.order.lineItems?.length === 0) return
    this.validateOptions()
    return await this.api.fetchCustomerCartContributionWidget(this.requestBody)
  }

  async renderToElement(
    options?: Partial<CustomerCartContributionWidgetParams>,
  ): Promise<HTMLElement | undefined> {
    const html = await this.renderToString(options)
    if (html) return this.parseHtml(html)
  }

  private updateDefaults({
                           color,
                           order,
                           withPopup,
                           popupTheme,
                           style,
                           version,
                         }: Partial<CustomerCartContributionWidgetParams>) {
    this.color = color ?? this.color
    this.order = order ?? this.order
    this.withPopup = withPopup ?? this.withPopup
    this.popupTheme = popupTheme ?? this.popupTheme
    this.style = style ?? this.style
    this.version = version ?? this.version
  }

  private validateOptions() {
    return WidgetValidator.for('Customer Cart Contribution Widget')
      .color(this.color)
      .withPopup(this.withPopup)
      .popupTheme(this.popupTheme)
      .style(this.style)
      .order(this.order)
      .validate()
  }
}
