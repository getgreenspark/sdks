import type { GreensparkWidgets } from './index'

declare global {
  interface Window {
    GreensparkWidgets: typeof GreensparkWidgets
  }
}

export {}
