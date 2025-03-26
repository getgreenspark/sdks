import { Widget } from '@/widgets/base'
import type { WidgetConfig } from '@/widgets/base'
import type { PerPurchaseWidgetByIdParams, WidgetParams } from '@/interfaces'

export class PerPurchaseWidgetById extends Widget implements PerPurchaseWidgetByIdParams {
  widgetId: string
  version: 'v2'

  constructor(params: WidgetConfig & PerPurchaseWidgetByIdParams & Required<WidgetParams>) {
    super(params)
    this.widgetId = params.widgetId
    this.version = params.version
  }

  private get requestBody(): PerPurchaseWidgetByIdParams & Required<WidgetParams> {
    return {
      widgetId: this.widgetId,
      version: this.version,
    }
  }

  private updateDefaults({
    widgetId,
    version,
  }: Partial<PerPurchaseWidgetByIdParams> & Required<WidgetParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.version = version ?? this.version
  }

  async render(
    options?: Partial<PerPurchaseWidgetByIdParams> & Required<WidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(
    options?: Partial<PerPurchaseWidgetByIdParams> & Required<WidgetParams>,
  ): Promise<string> {
    if (options) this.updateDefaults(options)
    const response = await this.api.fetchPerPurchaseWidgetById(this.requestBody)
    return response.data
  }

  async renderToElement(
    options?: Partial<PerPurchaseWidgetByIdParams> & Required<WidgetParams>,
  ): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
