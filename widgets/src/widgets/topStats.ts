import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'

import type { WidgetConfig } from '@/widgets/base'
import type { TopStatsWidgetParams } from '@/interfaces'

export class TopStatsWidget extends Widget implements TopStatsWidgetParams {
  color: (typeof WIDGET_COLORS.topStats)[number]

  constructor(params: WidgetConfig & TopStatsWidgetParams) {
    super(params)
    this.color = params.color
  }

  get topStatsWidgetRequestBody(): TopStatsWidgetParams {
    return {
      color: this.color,
    }
  }

  updateDefaults({ color }: Partial<TopStatsWidgetParams>) {
    this.color = color ?? this.color
  }

  validateOptions() {
    if (!WIDGET_COLORS.topStats.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the Top Stats Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.topStats.join(
          ', ',
        )}`,
      )
    }
  }

  async render(options?: Partial<TopStatsWidgetParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
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
