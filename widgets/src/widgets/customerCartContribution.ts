import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type {
  CustomerCartContributionWidgetParams,
  PopupTheme,
  StoreOrder,
  WidgetColor,
  WidgetStyle,
} from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class CustomerCartContributionWidget
  extends Widget
  implements CustomerCartContributionWidgetParams {
  color: WidgetColor
  order: StoreOrder
  withPopup?: boolean
  popupTheme?: PopupTheme
  style?: WidgetStyle
  version?: 'v2'

  constructor(params: WidgetConfig & CustomerCartContributionWidgetParams) {
    super(params)
    this.color = params.color
    this.order = params.order
    this.withPopup = params.withPopup ?? true
    this.popupTheme = params.popupTheme
    this.style = params.style ?? 'default'
    this.version = params.version
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
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
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
