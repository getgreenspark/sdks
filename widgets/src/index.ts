import {ApiConsumer} from '@/network'
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
import {DEFAULT_CONTAINER_CSS_SELECTOR} from '@/constants'

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
  cart(params: CartWidgetParams & { containerSelector?: string; useShadowDom?: boolean }) {
    const {containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom} = params
    return new CartWidget({...params, api: this.api, containerSelector, useShadowDom})
  }

  spendLevel(
    params: SpendLevelWidgetParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const {containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom} = params
    return new SpendLevelWidget({...params, api: this.api, containerSelector, useShadowDom})
  }

  perOrder(params: PerOrderWidgetParams & { containerSelector?: string; useShadowDom?: boolean }) {
    const {containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom} = params
    return new PerOrderWidget({...params, api: this.api, containerSelector, useShadowDom})
  }

  perPurchase(
    params: PerPurchaseWidgetParams &
      Required<WidgetParams> & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const {containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom} = params
    return new PerPurchaseWidget({...params, api: this.api, containerSelector, useShadowDom})
  }

  byPercentage(
    params: ByPercentageWidgetParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const {containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom} = params
    return new ByPercentageWidget({...params, api: this.api, containerSelector, useShadowDom})
  }

  tieredSpendLevel(
    params: TieredSpendLevelWidgetParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const {containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom} = params
    return new TieredSpendLevelWidget({...params, api: this.api, containerSelector, useShadowDom})
  }

  byPercentageOfRevenue(params: ByPercentageOfRevenueWidgetParams & {
    containerSelector?: string;
    useShadowDom?: boolean
  }) {
    const {containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom} = params
    return new ByPercentageOfRevenueWidget({...params, api: this.api, containerSelector, useShadowDom})
  }

  perProduct(
    params: PerProductWidgetParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const {containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom} = params
    return new PerProductWidget({...params, api: this.api, containerSelector, useShadowDom})
  }

  topStats(params: TopStatsWidgetParams & { containerSelector?: string; useShadowDom?: boolean }) {
    const {containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom} = params
    return new TopStatsWidget({...params, api: this.api, containerSelector, useShadowDom})
  }

  fullWidthBanner(
    params: FullWidthBannerWidgetParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const {containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom} = params
    return new FullWidthBannerWidget({...params, api: this.api, containerSelector, useShadowDom})
  }
}

window.GreensparkWidgets = GreensparkWidgets
