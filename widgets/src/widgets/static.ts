import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { StaticWidgetParams, StaticWidgetStyle, WidgetColor } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'

export class StaticWidget extends Widget implements StaticWidgetParams {
  color: WidgetColor
  version?: 'v2'
  style?: StaticWidgetStyle

  constructor(params: WidgetConfig & StaticWidgetParams) {
    super(params)
    this.color = params.color
    this.version = params.version
    this.style = params.style ?? 'default'
  }

  private get requestBody(): StaticWidgetParams {
    return {
      color: this.color,
      version: this.version,
      style: this.style,
    }
  }

  async render(options?: Partial<StaticWidgetParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    if (node) this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<StaticWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchStaticWidget(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<StaticWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }

  private updateDefaults({ color, version, style }: Partial<StaticWidgetParams>) {
    this.color = color ?? this.color
    this.version = version ?? this.version
    this.style = style ?? this.style
  }

  private validateOptions() {
    return WidgetValidator.for('Static Widget')
      .color(this.color)
      .staticStyle(this.style)
      .validate()
  }
}
