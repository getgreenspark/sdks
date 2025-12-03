import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type {
  CartWidgetParams,
  PopupTheme,
  StoreOrder,
  WidgetColor,
  WidgetStyle,
} from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class CartWidget extends Widget implements CartWidgetParams {
  color: WidgetColor
  order: StoreOrder
  withPopup?: boolean
  popupTheme?: PopupTheme
  style?: WidgetStyle
  version?: 'v2'

  constructor(params: WidgetConfig & CartWidgetParams) {
    super(params)
    this.color = params.color
    this.order = params.order
    this.withPopup = params.withPopup ?? true
    this.popupTheme = params.popupTheme
    this.style = params.style ?? 'default'
    this.version = params.version
  }

  private get requestBody(): CartWidgetParams {
    return {
      color: this.color,
      order: this.order,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      style: this.style,
      version: this.version,
    }
  }

  async render(options?: Partial<CartWidgetParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<CartWidgetParams>): Promise<string | undefined> {
    if (options) this.updateDefaults(options)
    if (!this.validateOptions()) return undefined
    return await this.api.fetchCartWidget(this.requestBody)
  }

  async renderToElement(options?: Partial<CartWidgetParams>): Promise<HTMLElement | undefined> {
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
                         }: Partial<CartWidgetParams>) {
    this.color = color ?? this.color
    this.order = order ?? this.order
    this.withPopup = withPopup ?? this.withPopup
    this.popupTheme = popupTheme ?? this.popupTheme
    this.style = style ?? this.style
    this.version = version ?? this.version
  }

  private validateOptions(): boolean {
    return WidgetValidator.for('Cart Widget')
      .color(this.color)
      .withPopup(this.withPopup)
      .popupTheme(this.popupTheme)
      .style(this.style)
      .order(this.order)
      .validate()
  }
}
