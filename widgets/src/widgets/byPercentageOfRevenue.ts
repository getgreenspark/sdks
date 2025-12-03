import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type {
  ByPercentageOfRevenueWidgetParams,
  PopupTheme,
  WidgetColor,
  WidgetStyle,
} from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class ByPercentageOfRevenueWidget
  extends Widget
  implements ByPercentageOfRevenueWidgetParams {
  color: WidgetColor
  withPopup?: boolean
  popupTheme?: PopupTheme
  style?: WidgetStyle
  version?: 'v2'

  constructor(params: WidgetConfig & ByPercentageOfRevenueWidgetParams) {
    super(params)
    this.color = params.color
    this.withPopup = params.withPopup ?? true
    this.popupTheme = params.popupTheme
    this.style = params.style ?? 'default'
    this.version = params.version
  }

  private get requestBody(): ByPercentageOfRevenueWidgetParams {
    return {
      color: this.color,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      style: this.style,
      version: this.version,
    }
  }

  async render(
    options?: Partial<ByPercentageOfRevenueWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<ByPercentageOfRevenueWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchByPercentageOfRevenueWidget(this.requestBody)
    return response.data
  }

  async renderToElement(
    options?: Partial<ByPercentageOfRevenueWidgetParams>,
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
                         }: Partial<ByPercentageOfRevenueWidgetParams>) {
    this.color = color ?? this.color
    this.withPopup = withPopup ?? this.withPopup
    this.popupTheme = popupTheme ?? this.popupTheme
    this.style = style ?? this.style
    this.version = version ?? this.version
  }

  private validateOptions() {
    return WidgetValidator.for('By Percentage Of Revenue Widget')
      .color(this.color)
      .withPopup(this.withPopup)
      .popupTheme(this.popupTheme)
      .style(this.style)
      .validate()
  }
}
