import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'
import type { WidgetConfig } from '@/widgets/base'
import type {
  OrderProduct,
  CartWidgetParams,
  StoreOrder,
  WidgetStyle,
  PopupTheme,
  WidgetColor,
} from '@/interfaces'

export class CartWidget extends Widget implements CartWidgetParams {
  color: WidgetColor
  order: StoreOrder
  withPopup?: boolean
  popupTheme?: PopupTheme
  style?: WidgetStyle
  version?: 'v2'
  isCustomerContributionAvailable?: boolean

  constructor(params: WidgetConfig & CartWidgetParams) {
    super(params)
    this.color = params.color
    this.order = params.order
    this.withPopup = params.withPopup ?? true
    this.popupTheme = params.popupTheme
    this.style = params.style ?? 'default'
    this.version = params.version
    this.isCustomerContributionAvailable = params.isCustomerContributionAvailable ?? false
  }

  private get requestBody(): CartWidgetParams {
    return {
      color: this.color,
      order: this.order,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      style: this.style,
      version: this.version,
      isCustomerContributionAvailable: this.isCustomerContributionAvailable,
    }
  }

  private updateDefaults({
    color,
    order,
    withPopup,
    popupTheme,
    style,
    version,
  }: Partial<CartWidgetParams>) {
    this.color = color ?? this.color
    this.order = order ?? this.order
    this.withPopup = withPopup ?? this.withPopup
    this.popupTheme = popupTheme ?? this.popupTheme
    this.style = style ?? this.style
    this.version = version ?? this.version
    this.isCustomerContributionAvailable =
      this.isCustomerContributionAvailable ?? this.isCustomerContributionAvailable
  }

  private validateOptions() {
    if (!WIDGET_COLORS.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the Cart Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.join(
          ', ',
        )}`,
      )
    }

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
        `Greenspark - ${this.order.lineItems} was provided as the order's items, but this value is not valid. Please provide a valid array of items to the Cart Widget.`,
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

  async render(options?: Partial<CartWidgetParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<CartWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchCartWidget(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<CartWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
