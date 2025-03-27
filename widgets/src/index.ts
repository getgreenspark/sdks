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
  PerOrderWidgetById,
  StaticWidgetById,
  TieredSpendLevelWidgetById,
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
  StaticWidgetParams,
  CartWidgetByIdParams,
  SpendLevelWidgetByIdParams,
  PerProductWidgetByIdParams,
  ByPercentageWidgetByIdParams,
  ByPercentageOfRevenueWidgetByIdParams,
  PerOrderWidgetByIdParams,
  StaticWidgetByIdParams,
  TieredSpendLevelWidgetByIdParams, TopStatsWidgetByIdParams,
} from '@/interfaces'
import { StaticWidget } from '@/widgets/static'
import { CartWidgetById } from '@/widgets/cartById'
import { SpendLevelWidgetById } from '@/widgets/spendLevelById'
import { PerProductWidgetById } from '@/widgets/perProductById'
import { ByPercentageWidgetById } from '@/widgets/byPercentageById'
import { ByPercentageOfRevenueWidgetById } from '@/widgets/byPercentageOfRevenueById'
import { TopStatsWidgetById } from '@/widgets/topStatsById'

export default class GreensparkWidgets extends ApiConsumer {
  cart(params: CartWidgetParams & { containerSelector?: string; useShadowDom?: boolean }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new CartWidget({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  cartById(params: CartWidgetByIdParams & { containerSelector?: string; useShadowDom?: boolean }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new CartWidgetById({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  spendLevel(
    params: SpendLevelWidgetParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new SpendLevelWidget({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  spendLevelById(
    params: SpendLevelWidgetByIdParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new SpendLevelWidgetById({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  perOrder(params: PerOrderWidgetParams & { containerSelector?: string; useShadowDom?: boolean }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new PerOrderWidget({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  perOrderById(
    params: PerOrderWidgetByIdParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new PerOrderWidgetById({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  perPurchase(
    params: PerPurchaseWidgetParams &
      Required<WidgetParams> & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new PerPurchaseWidget({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  byPercentage(
    params: ByPercentageWidgetParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new ByPercentageWidget({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  byPercentageById(
    params: ByPercentageWidgetByIdParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new ByPercentageWidgetById({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  tieredSpendLevel(
    params: TieredSpendLevelWidgetParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new TieredSpendLevelWidget({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  tieredSpendLevelById(
    params: TieredSpendLevelWidgetByIdParams & {
      containerSelector?: string
      useShadowDom?: boolean
    },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new TieredSpendLevelWidgetById({
      ...params,
      api: this.api,
      containerSelector,
      useShadowDom,
    })
  }

  byPercentageOfRevenue(
    params: ByPercentageOfRevenueWidgetParams & {
      containerSelector?: string
      useShadowDom?: boolean
    },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new ByPercentageOfRevenueWidget({
      ...params,
      api: this.api,
      containerSelector,
      useShadowDom,
    })
  }

  byPercentageOfRevenueById(
    params: ByPercentageOfRevenueWidgetByIdParams & {
      containerSelector?: string
      useShadowDom?: boolean
    },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new ByPercentageOfRevenueWidgetById({
      ...params,
      api: this.api,
      containerSelector,
      useShadowDom,
    })
  }

  perProduct(
    params: PerProductWidgetParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new PerProductWidget({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  perProductById(
    params: PerProductWidgetByIdParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new PerProductWidgetById({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  static(params: StaticWidgetParams & { containerSelector?: string; useShadowDom?: boolean }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new StaticWidget({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  staticById(
    params: StaticWidgetByIdParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new StaticWidgetById({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  topStats(params: TopStatsWidgetParams & { containerSelector?: string; useShadowDom?: boolean }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new TopStatsWidget({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  topStatsById(params: TopStatsWidgetByIdParams & { containerSelector?: string; useShadowDom?: boolean }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new TopStatsWidgetById({ ...params, api: this.api, containerSelector, useShadowDom })
  }

  fullWidthBanner(
    params: FullWidthBannerWidgetParams & { containerSelector?: string; useShadowDom?: boolean },
  ) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR, useShadowDom } = params
    return new FullWidthBannerWidget({ ...params, api: this.api, containerSelector, useShadowDom })
  }
}

window.GreensparkWidgets = GreensparkWidgets
