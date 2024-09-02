import { Widget } from '@/widgets/base'
import { WIDGET_COLORS } from '@/constants'

import type { WidgetConfig } from '@/widgets/base'
import type { TieredSpendLevelWidgetParams } from '@/interfaces'

export class TieredSpendLevelWidget extends Widget implements TieredSpendLevelWidgetParams {
  color: (typeof WIDGET_COLORS.tieredSpendLevel)[number]
  currency: string
  withPopup?: boolean
  version?: string

  constructor(params: WidgetConfig & TieredSpendLevelWidgetParams) {
    super(params)
    this.color = params.color
    this.currency = params.currency
    this.withPopup = params.withPopup ?? true
    this.version = params.version
  }

  get tieredSpendLevelWidgetRequestBody(): TieredSpendLevelWidgetParams {
    return {
      color: this.color,
      currency: this.currency,
      withPopup: this.withPopup,
      version: this.version,
    }
  }

  updateDefaults({ color, currency, withPopup, version }: Partial<TieredSpendLevelWidgetParams>) {
    this.color = color ?? this.color
    this.currency = currency ?? this.currency
    this.withPopup = withPopup ?? this.withPopup
    this.version = version
  }

  validateOptions() {
    if (!WIDGET_COLORS.tieredSpendLevel.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the Tiered Spend Level Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.tieredSpendLevel.join(
          ', ',
        )}`,
      )
    }

    if (!(typeof this.currency === 'string')) {
      throw new Error(
        `Greenspark - "${this.currency}" was selected as the currency for the Tiered Spend Level Widget, but this currency is not available. Please use a valid currency code like "USD", "GBP" and "EUR".`,
      )
    }
  }

  async render(
    options?: Partial<TieredSpendLevelWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<TieredSpendLevelWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchTieredSpendLevelWidget(
      this.tieredSpendLevelWidgetRequestBody,
    )
    return response.data
  }

  async renderToElement(options?: Partial<TieredSpendLevelWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
