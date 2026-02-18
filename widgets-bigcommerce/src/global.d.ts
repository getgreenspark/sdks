import type GreensparkWidgets from '@/index'
import type { CartWidgetById } from '@/widgets/cartById'

export type GreensparkCartWidgetKey = `greensparkCartWidget-${string}`

declare global {
  interface Window extends Partial<Record<GreensparkCartWidgetKey, CartWidgetById>> {
    GreensparkWidgets: typeof GreensparkWidgets
  }
}

export {}
