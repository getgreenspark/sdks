import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type {
  PopupTheme,
  TieredSpendLevelWidgetParams,
  WidgetColor,
  WidgetStyle,
} from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class TieredSpendLevelWidget extends Widget implements TieredSpendLevelWidgetParams {
  color: WidgetColor
  currency: string
  withPopup?: boolean
  popupTheme?: PopupTheme
  style?: WidgetStyle
  version?: 'v2'

  constructor(params: WidgetConfig & TieredSpendLevelWidgetParams) {
    super(params)
    this.color = params.color
    this.currency = params.currency
    this.withPopup = params.withPopup ?? true
    this.popupTheme = params.popupTheme
    this.style = params.style ?? 'default'
    this.version = params.version
  }

  private get requestBody(): TieredSpendLevelWidgetParams {
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
    options?: Partial<TieredSpendLevelWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<TieredSpendLevelWidgetParams>): Promise<string | undefined> {
    if (options) this.updateDefaults(options)
    if (!this.validateOptions()) return undefined
    const response = await this.api.fetchTieredSpendLevelWidget(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<TieredSpendLevelWidgetParams>): Promise<HTMLElement | undefined> {
    const html = await this.renderToString(options)
    if (html) return this.parseHtml(html)
  }

  private updateDefaults({
                           color,
                           currency,
                           withPopup,
                           popupTheme,
                           version,
                           style,
                         }: Partial<TieredSpendLevelWidgetParams>) {
    this.color = color ?? this.color
    this.currency = currency ?? this.currency
    this.withPopup = withPopup ?? this.withPopup
    this.popupTheme = popupTheme ?? this.popupTheme
    this.version = version ?? this.version
    this.style = style ?? this.style
  }

  private validateOptions(): boolean {
    return WidgetValidator.for('Tiered Spend Level Widget')
      .color(this.color)
      .withPopup(this.withPopup)
      .popupTheme(this.popupTheme)
      .style(this.style)
      .currency(this.currency)
      .validate()
  }
}
