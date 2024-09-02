import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'

import type { WidgetConfig } from '@/widgets/base'
import type { PerProductWidgetParams } from '@/interfaces'

export class PerProductWidget extends Widget implements PerProductWidgetParams {
  color: (typeof WIDGET_COLORS)[number]
  productId: string
  withPopup?: boolean

  constructor(params: WidgetConfig & PerProductWidgetParams) {
    super(params)
    this.color = params.color
    this.productId = params.productId
    this.withPopup = params.withPopup ?? true
  }

  get perProductWidgetRequestBody(): PerProductWidgetParams {
    return {
      color: this.color,
      productId: this.productId,
      withPopup: this.withPopup,
    }
  }

  updateDefaults({ color, productId, withPopup }: Partial<PerProductWidgetParams>) {
    this.color = color ?? this.color
    this.productId = productId ?? this.productId
    this.withPopup = withPopup ?? this.withPopup
  }

  validateOptions() {
    if (!WIDGET_COLORS.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the Per Product Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.join(
          ', ',
        )}`,
      )
    }

    if (!(typeof this.productId === 'string') || this.productId === '') {
      throw new Error(
        `Greenspark - "${this.productId}" was selected as the product for the Per Product Widget, but this product ID is not valid. Please use a valid string.`,
      )
    }
  }

  async render(
    options?: Partial<PerProductWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<PerProductWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchPerProductWidget(this.perProductWidgetRequestBody)
    return response.data
  }

  async renderToElement(options?: Partial<PerProductWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
