import { ApiConsumer } from '@/network'
import {
  CartWidget,
  SpendLevelWidget,
  PerOrderWidget,
  ByPercentageWidget,
  TieredSpendLevelWidget,
} from '@/widgets'
import { DEFAULT_CONTAINER_CSS_SELECTOR } from '@/constants'

import type {
  ByPercentageWidgetParams,
  CartWidgetParams,
  PerOrderWidgetParams,
  SpendLevelWidgetParams,
  TieredSpendLevelWidgetParams,
} from '@/interfaces'

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

  byPercentage(params: ByPercentageWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new ByPercentageWidget({ ...params, api: this.api, containerSelector })
  }

  tieredSpendLevel(params: TieredSpendLevelWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new TieredSpendLevelWidget({ ...params, api: this.api, containerSelector })
  }
}

window.GreensparkWidgets = GreensparkWidgets
