import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { PerOrderWidgetParams, PopupTheme, WidgetColor, WidgetStyle } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class PerOrderWidget extends Widget implements PerOrderWidgetParams {
  color: WidgetColor
  withPopup?: boolean
  popupTheme?: PopupTheme
  style?: WidgetStyle
  version?: 'v2'

  constructor(params: WidgetConfig & PerOrderWidgetParams) {
    super(params)
    this.color = params.color
    this.withPopup = params.withPopup ?? true
    this.popupTheme = params.popupTheme
    this.style = params.style ?? 'default'
    this.version = params.version
  }

  private get requestBody(): PerOrderWidgetParams {
    return {
      color: this.color,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      style: this.style,
      version: this.version,
    }
  }

  async render(options?: Partial<PerOrderWidgetParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<PerOrderWidgetParams>): Promise<string | undefined> {
    if (options) this.updateDefaults(options)
    if (!this.validateOptions()) return undefined
    const response = await this.api.fetchPerOrderWidget(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<PerOrderWidgetParams>): Promise<HTMLElement | undefined> {
    const html = await this.renderToString(options)
    if (html) return this.parseHtml(html)
  }

  private updateDefaults({
                           color,
                           withPopup,
                           popupTheme,
                           style,
                           version,
                         }: Partial<PerOrderWidgetParams>) {
    this.color = color ?? this.color
    this.withPopup = withPopup ?? this.withPopup
    this.popupTheme = popupTheme ?? this.popupTheme
    this.style = style ?? this.style
    this.version = version ?? this.version
  }

  private validateOptions(): boolean {
    return WidgetValidator.for('Per Order Widget')
      .color(this.color)
      .withPopup(this.withPopup)
      .popupTheme(this.popupTheme)
      .style(this.style)
      .validate()
  }
}
