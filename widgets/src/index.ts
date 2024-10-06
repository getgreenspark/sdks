import { ApiConsumer } from '@/network'
import {
  CartWidget,
  SpendLevelWidget,
  PerOrderWidget,
  PerPurchaseWidget,
  ByPercentageWidget,
  ByPercentageOfRevenueWidget,
  TieredSpendLevelWidget,
  PerProductWidget,
  TopStatsWidget,
  FullWidthBannerWidget,
} from '@/widgets'
import { DEFAULT_CONTAINER_CSS_SELECTOR } from '@/constants'

import type {
  ByPercentageWidgetParams,
  ByPercentageOfRevenueWidgetParams,
  CartWidgetParams,
  FullWidthBannerWidgetParams,
  PerOrderWidgetParams,
  PerProductWidgetParams,
  PerPurchaseWidgetParams,
  SpendLevelWidgetParams,
  TieredSpendLevelWidgetParams,
  TopStatsWidgetParams,
  WidgetParams,
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

  perPurchase(
    params: PerPurchaseWidgetParams & Required<WidgetParams> & { containerSelector?: string },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new PerPurchaseWidget({ ...params, api: this.api, containerSelector })
  }

  byPercentage(params: ByPercentageWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new ByPercentageWidget({ ...params, api: this.api, containerSelector })
  }

  byPercentageOfRevenue(params: ByPercentageOfRevenueWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new ByPercentageOfRevenueWidget({ ...params, api: this.api, containerSelector })
  }

  tieredSpendLevel(params: TieredSpendLevelWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new TieredSpendLevelWidget({ ...params, api: this.api, containerSelector })
  }

  perProduct(params: PerProductWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new PerProductWidget({ ...params, api: this.api, containerSelector })
  }

  topStats(params: TopStatsWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new TopStatsWidget({ ...params, api: this.api, containerSelector })
  }

  fullWidthBanner(params: FullWidthBannerWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new FullWidthBannerWidget({ ...params, api: this.api, containerSelector })
  }
}

window.GreensparkWidgets = GreensparkWidgets
