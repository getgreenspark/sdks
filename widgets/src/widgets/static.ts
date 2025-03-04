import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'

import type { WidgetConfig } from '@/widgets/base'
import type { StaticWidgetParams } from '@/interfaces'

export class StaticWidget extends Widget implements StaticWidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  version?: 'v2'

  constructor(params: WidgetConfig & StaticWidgetParams) {
    super(params)
    this.color = params.color
    this.version = params.version
  }

  get staticWidgetRequestBody(): StaticWidgetParams {
    return {
      color: this.color,
      version: this.version,
    }
  }

  updateDefaults({ color, version }: Partial<StaticWidgetParams>) {
    this.color = color ?? this.color
    this.version = version ?? this.version
  }

  validateOptions() {
    if (!WIDGET_COLORS.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the Static Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.join(
          ', ',
        )}`,
      )
    }
  }

  async render(options?: Partial<StaticWidgetParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<StaticWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchStaticWidget(this.staticWidgetRequestBody)
    return response.data
  }

  async renderToElement(options?: Partial<StaticWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
