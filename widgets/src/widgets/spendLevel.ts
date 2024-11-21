import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'

import type { WidgetConfig } from '@/widgets/base'
import type { PopupTheme, SpendLevelWidgetParams, WidgetStyle } from '@/interfaces'

export class SpendLevelWidget extends Widget implements SpendLevelWidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  currency: string
  withPopup?: boolean
  popupTheme?: PopupTheme
  style?: WidgetStyle
  version?: 'v2'

  constructor(params: WidgetConfig & SpendLevelWidgetParams) {
    super(params)
    this.color = params.color
    this.currency = params.currency
    this.withPopup = params.withPopup ?? true
    this.popupTheme = params.popupTheme
    this.style = params.style ?? 'default'
    this.version = params.version
  }

  get spendLevelRequestBody(): SpendLevelWidgetParams {
    return {
      color: this.color,
      currency: this.currency,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      style: this.style,
      version: this.version,
    }
  }

  updateDefaults({
    color,
    currency,
    withPopup,
    popupTheme,
    style,
    version,
  }: Partial<SpendLevelWidgetParams>) {
    this.color = color ?? this.color
    this.currency = currency ?? this.currency
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
        }" was selected as the color for the Spend Level Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.join(
          ', ',
        )}`,
      )
    }

    if (!(typeof this.currency === 'string')) {
      throw new Error(
        `Greenspark - "${this.currency}" was selected as the widget's currency for the Spend Level Widget, but this currency is not available. Please use a valid currency code like "USD", "GBP" and "EUR".`,
      )
    }
  }

  async render(
    options?: Partial<SpendLevelWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<SpendLevelWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchSpendLevelWidget(this.spendLevelRequestBody)
    return response.data
  }

  async renderToElement(options?: Partial<SpendLevelWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
