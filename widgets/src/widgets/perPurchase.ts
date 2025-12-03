import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type {
  PerPurchaseWidgetParams,
  PopupTheme,
  WidgetColor,
  WidgetParams,
  WidgetStyle,
} from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class PerPurchaseWidget extends Widget implements PerPurchaseWidgetParams {
  color: WidgetColor
  withPopup?: boolean
  popupTheme?: PopupTheme
  style?: WidgetStyle
  version: 'v2'

  constructor(params: WidgetConfig & PerPurchaseWidgetParams & Required<WidgetParams>) {
    super(params)
    this.color = params.color
    this.withPopup = params.withPopup ?? true
    this.popupTheme = params.popupTheme
    this.style = params.style ?? 'default'
    this.version = params.version
  }

  private get requestBody(): PerPurchaseWidgetParams & Required<WidgetParams> {
    return {
      color: this.color,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      style: this.style,
      version: this.version,
    }
  }

  async render(
    options?: Partial<PerPurchaseWidgetParams> & Required<WidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(
    options?: Partial<PerPurchaseWidgetParams> & Required<WidgetParams>,
  ): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchPerPurchaseWidget(this.requestBody)
    return response.data
  }

  async renderToElement(
    options?: Partial<PerPurchaseWidgetParams> & Required<WidgetParams>,
  ): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }

  private updateDefaults({
                           color,
                           withPopup,
                           popupTheme,
                           style,
                           version,
                         }: Partial<PerPurchaseWidgetParams> & Required<WidgetParams>) {
    this.color = color ?? this.color
    this.withPopup = withPopup ?? this.withPopup
    this.popupTheme = popupTheme ?? this.popupTheme
    this.style = style ?? this.style
    this.version = version ?? this.version
  }

  private validateOptions() {
    return WidgetValidator.for('Per Purchase Widget')
      .color(this.color)
      .withPopup(this.withPopup)
      .popupTheme(this.popupTheme)
      .style(this.style)
      .validate()
  }
}
