import { Widget } from '@/widgets/base'

import type { WidgetConfig } from '@/widgets/base'
import type { PerOrderByIdWidgetParams } from '@/interfaces'

export class PerOrderByIdWidget extends Widget implements PerOrderByIdWidgetParams {
  currency: string
  version?: 'v2'

  constructor(params: WidgetConfig & PerOrderByIdWidgetParams) {
    super(params)
    this.currency = params.currency
    this.version = params.version
  }

  get perOrderRequestBody(): PerOrderByIdWidgetParams {
    return {
      currency: this.currency,
      version: this.version,
    }
  }

  updateDefaults({ currency, version }: Partial<PerOrderByIdWidgetParams>) {
    this.currency = currency ?? this.currency
    this.version = version ?? this.version
  }

  validateOptions() {
    if (!(typeof this.currency === 'string')) {
      throw new Error(
        `Greenspark - "${this.currency}" was selected as the widget's currency for the Per Order Widget, but this currency is not available. Please use a valid currency code like "USD", "GBP" and "EUR".`,
      )
    }
  }

  async render(
    options?: Partial<PerOrderByIdWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<PerOrderByIdWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchWidgetById(this.perOrderRequestBody)
    return response.data
  }

  async renderToElement(options?: Partial<PerOrderByIdWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
