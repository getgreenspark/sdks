import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { PopupTheme, SpendLevelWidgetParams, WidgetColor, WidgetStyle } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class SpendLevelWidget extends Widget implements SpendLevelWidgetParams {
  color: WidgetColor
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

  private get requestBody(): SpendLevelWidgetParams {
    return {
      color: this.color,
      currency: this.currency,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      style: this.style,
      version: this.version,
    }
  }

  async render(
    options?: Partial<SpendLevelWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<SpendLevelWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchSpendLevelWidget(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<SpendLevelWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }

  private updateDefaults({
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

  private validateOptions() {
    return WidgetValidator.for('Spend Level Widget')
      .color(this.color)
      .withPopup(this.withPopup)
      .popupTheme(this.popupTheme)
      .style(this.style)
      .currency(this.currency)
      .validate()
  }
}
