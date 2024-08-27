import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'

import type { WidgetConfig } from '@/widgets/base'
import type { ByPercentageWidgetParams } from '@/interfaces'

export class ByPercentageWidget extends Widget implements ByPercentageWidgetParams {
  color: (typeof WIDGET_COLORS.byPercentage)[number]
  withPopup?: boolean

  constructor(params: WidgetConfig & ByPercentageWidgetParams) {
    super(params)
    this.color = params.color
    this.withPopup = params.withPopup ?? true
  }

  get byPercentageWidgetRequestBody(): ByPercentageWidgetParams {
    return {
      color: this.color,
      withPopup: this.withPopup,
    }
  }

  updateDefaults({ color, withPopup }: Partial<ByPercentageWidgetParams>) {
    this.color = color ?? this.color
    this.withPopup = withPopup ?? this.withPopup
  }

  validateOptions() {
    if (!WIDGET_COLORS.byPercentage.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the By Percentage Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.byPercentage.join(
          ', ',
        )}`,
      )
    }
  }

  async render(
    options?: Partial<ByPercentageWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToNode(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<ByPercentageWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchByPercentageWidget(this.byPercentageWidgetRequestBody)
    return response.data
  }

  async renderToNode(options?: Partial<ByPercentageWidgetParams>): Promise<Node> {
    const html = await this.renderToString(options)
    const parser = new DOMParser()
    const parsedWidget = parser.parseFromString(html, 'text/html')

    const { firstChild } = parsedWidget.body
    if (firstChild === null) {
      throw new Error(
        `Greenspark - An error occurred when trying to execute 'renderToNode'. Failed to render ${html} `,
      )
    }

    return firstChild
  }
}
