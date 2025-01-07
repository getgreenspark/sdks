import type GreensparkWidgets from '@/index'
import type { Shopify } from './interfaces'

declare global {
  interface Window {
    GreensparkWidgets: typeof GreensparkWidgets
    Shopify: Shopify
  }
}

export {}
