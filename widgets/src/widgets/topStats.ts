import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'

import type { WidgetConfig } from '@/widgets/base'
import type { LayoutConfig, TopStatsWidgetParams } from '@/interfaces'

export class TopStatsWidget extends Widget implements TopStatsWidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  withPopup?: boolean
  version?: 'v2'

  constructor(params: WidgetConfig & TopStatsWidgetParams) {
    super(params)
    this.color = params.color
    this.withPopup = params.withPopup
    this.version = params.version
  }

  get topStatsWidgetRequestBody(): TopStatsWidgetParams {
    return {
      color: this.color,
      withPopup: this.withPopup,
      version: this.version,
    }
  }

  updateDefaults({ color, withPopup, version }: Partial<TopStatsWidgetParams>) {
    this.color = color ?? this.color
    this.withPopup = withPopup ?? this.withPopup
    this.version = version ?? this.version
  }

  validateOptions() {
    if (!WIDGET_COLORS.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the Top Stats Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.join(
          ', ',
        )}`,
      )
    }
  }

  async render(
    options?: Partial<TopStatsWidgetParams>,
    containerSelector?: string,
    layout?: Partial<LayoutConfig>,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector, layout)
  }

  async renderToString(options?: Partial<TopStatsWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchTopStatsWidget(this.topStatsWidgetRequestBody)
    return response.data
  }

  async renderToElement(options?: Partial<TopStatsWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
