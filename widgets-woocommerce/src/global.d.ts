import type GreensparkWidgets from '@/index'
import type { CartWidgetById } from '@/widgets/cartById'

export type GreensparkCartWidgetKey = `greensparkCartWidget-${string}`

interface GreensparkWCContext {
  currency: string
  locale: string
  productId: string
  storeApiBase: string
}

declare global {
  interface Window extends Partial<Record<GreensparkCartWidgetKey, CartWidgetById>> {
    GreensparkWidgets: typeof GreensparkWidgets
    greensparkWC?: GreensparkWCContext
    /** Set when fetch/XHR cart hooks are installed (idempotent across duplicate script tags). */
    __greensparkWcCartMutationHooks?: boolean
  }

  /** WooCommerce pages include jQuery globally. */
  const jQuery: ((selector: string | Node) => {
    on: (event: string, handler: () => void) => void
  }) | undefined
}

export {}
