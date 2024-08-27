import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'

import type { WidgetConfig } from '@/widgets/base'
import type { PerOrderWidgetParams } from '@/interfaces'

export class PerOrderWidget extends Widget implements PerOrderWidgetParams {
  color: (typeof WIDGET_COLORS.perOrder)[number]
  currency: string
  withPopup?: boolean

  constructor(params: WidgetConfig & PerOrderWidgetParams) {
    super(params)
    this.color = params.color
    this.currency = params.currency
    this.withPopup = params.withPopup ?? true
  }

  get perOrderRequestBody(): PerOrderWidgetParams {
    return {
      color: this.color,
      currency: this.currency,
      withPopup: this.withPopup,
    }
  }

  updateDefaults({ color, currency, withPopup }: Partial<PerOrderWidgetParams>) {
    this.color = color ?? this.color
    this.currency = currency ?? this.currency
    this.withPopup = withPopup ?? this.withPopup
  }

  validateOptions() {
    if (!WIDGET_COLORS.perOrder.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the Per Order Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.spendLevel.join(
          ', ',
        )}`,
      )
    }

    if (!(typeof this.currency === 'string')) {
      throw new Error(
        `Greenspark - "${this.currency}" was selected as the widget's currency for the Per Order Widget, but this currency is not available. Please use a valid currency code like "USD", "GBP" and "EUR".`,
      )
    }
  }

  async render(options?: Partial<PerOrderWidgetParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToNode(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<PerOrderWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchPerOrderWidget(this.perOrderRequestBody)
    return response.data
  }

  async renderToNode(options?: Partial<PerOrderWidgetParams>): Promise<Node> {
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
