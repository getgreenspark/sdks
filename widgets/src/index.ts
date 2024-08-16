import { ApiConsumer } from '@/network'
import { CartWidget } from '@/widgets'
import { DEFAULT_CONTAINER_CSS_SELECTOR } from '@/constants'

import type { CartWidgetParams } from '@/interfaces'

export class GreensparkWidgets extends ApiConsumer {
  cart(params: CartWidgetParams & { containerSelector?: string }) {
    const { containerSelector = DEFAULT_CONTAINER_CSS_SELECTOR } = params
    return new CartWidget({ ...params, api: this.api, containerSelector })
  }
}
