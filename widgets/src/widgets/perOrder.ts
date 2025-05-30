import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'
import type { WidgetConfig } from '@/widgets/base'
import type { PerOrderWidgetParams, PopupTheme, WidgetStyle, WidgetColor } from '@/interfaces'

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

  private validateOptions() {
    if (!WIDGET_COLORS.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the Per Order Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.join(
          ', ',
        )}`,
      )
    }
  }

  async render(options?: Partial<PerOrderWidgetParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<PerOrderWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchPerOrderWidget(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<PerOrderWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
