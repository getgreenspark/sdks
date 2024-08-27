import { ApiConsumer } from '@/network'
import { CartWidget, SpendLevelWidget, PerOrderWidget } from '@/widgets'
import { DEFAULT_CONTAINER_CSS_SELECTOR } from '@/constants'

import type { CartWidgetParams, PerOrderWidgetParams, SpendLevelWidgetParams } from '@/interfaces'

export default class GreensparkWidgets extends ApiConsumer {
  cart(params: CartWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new CartWidget({ ...params, api: this.api, containerSelector })
  }

  spendLevel(params: SpendLevelWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new SpendLevelWidget({ ...params, api: this.api, containerSelector })
  }

  perOrder(params: PerOrderWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new PerOrderWidget({ ...params, api: this.api, containerSelector })
  }
}

window.GreensparkWidgets = GreensparkWidgets
