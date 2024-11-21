import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'

import type { WidgetConfig } from '@/widgets/base'
import type { ByPercentageOfRevenueWidgetParams, PopupTheme, WidgetStyle } from '@/interfaces'

export class ByPercentageOfRevenueWidget
  extends Widget
  implements ByPercentageOfRevenueWidgetParams
{
  color: (typeof WIDGET_COLORS)[number]
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

  get byPercentageOfRevenueWidgetRequestBody(): ByPercentageOfRevenueWidgetParams {
    return {
      color: this.color,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      style: this.style,
      version: this.version,
    }
  }

  updateDefaults({
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

  validateOptions() {
    if (!WIDGET_COLORS.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the By Percentage Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.join(
          ', ',
        )}`,
      )
    }
  }

  async render(
    options?: Partial<ByPercentageOfRevenueWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<ByPercentageOfRevenueWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchByPercentageOfRevenueWidget(
      this.byPercentageOfRevenueWidgetRequestBody,
    )
    return response.data
  }

  async renderToElement(
    options?: Partial<ByPercentageOfRevenueWidgetParams>,
  ): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
