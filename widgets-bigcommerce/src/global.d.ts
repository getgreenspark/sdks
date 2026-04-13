import type GreensparkWidgets from '@/index'
import type {CartWidget} from '@/widgets/cart'
import type {CartWidgetById} from '@/widgets/cartById'

export type GreensparkCartWidgetKey = `greensparkCartWidget-${string}`

declare global {
  interface Window extends Partial<Record<GreensparkCartWidgetKey, CartWidget | CartWidgetById>> {
    GreensparkWidgets: typeof GreensparkWidgets
  }
}

export {}
