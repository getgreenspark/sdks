import { Widget } from '@/widgets/base'

import type { WidgetConfig } from '@/widgets/base'
import {StoreOrder, WidgetByIdParams} from '@/interfaces'
import type {IMPACT_TYPES} from "@/constants";

export class ByIdWidget extends Widget implements WidgetByIdParams {
  widgetId!: string
  currency?: string
  productId?: string;
  order?: StoreOrder;
  impactTypes?: (typeof IMPACT_TYPES)[number][]
  version?: 'v2'

  constructor(params: WidgetConfig & WidgetByIdParams) {
    super(params)
    this.widgetId = params.widgetId
    this.currency = params.currency
    this.productId = params.productId
    this.order = params.order
    this.impactTypes = params.impactTypes
    this.version = params.version
  }

  get widgetByIdRequestBody(): WidgetByIdParams {
    return {
      widgetId: this.widgetId,
      currency: this.currency,
      productId: this.productId,
      order: this.order,
      impactTypes: this.impactTypes,
      version: this.version,
    }
  }

  updateDefaults({ widgetId, currency, productId, order, impactTypes, version }: Partial<WidgetByIdParams>) {
    this.widgetId = widgetId ?? this.widgetId
    this.currency = currency ?? this.currency
    this.productId = productId ?? this.productId
    this.order = order ?? this.order
    this.impactTypes = impactTypes ?? this.impactTypes
    this.version = version ?? this.version
  }

  async render(
    options?: Partial<WidgetByIdParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<WidgetByIdParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    const response = await this.api.fetchWidgetById(this.widgetByIdRequestBody)
    return response.data
  }

  async renderToElement(options?: Partial<WidgetByIdParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
