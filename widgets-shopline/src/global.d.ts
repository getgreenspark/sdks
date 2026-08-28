import type GreensparkWidgets from '@/index'
import type { CartWidgetById } from '@/widgets/cartById'

export type GreensparkCartWidgetKey = `greensparkCartWidget-${string}`

export interface ThemeEventDetail {
  [key: string]: unknown
}

export interface ThemeEventInstance {
  detail?: ThemeEventDetail
}

export interface ThemeEventCenter {
  dispatch(event: unknown): void
  addListener?(
    eventName: string,
    callback: (event: ThemeEventInstance) => void,
  ): { remove?: () => void }
  addEventListener?(eventName: string, callback: (event: ThemeEventInstance) => void): void
  getCurrentDetail?(eventName: string): ThemeEventDetail | undefined
}

export interface ThemeEventConstructor {
  new (eventName: string, init: { detail: ThemeEventDetail }): unknown
}

declare global {
  interface Window extends Partial<Record<GreensparkCartWidgetKey, CartWidgetById>> {
    GreensparkWidgets: typeof GreensparkWidgets
    Shopline?: { designMode?: boolean }
    ThemeEvent?: ThemeEventConstructor
    themeEventCenter?: ThemeEventCenter
    _greensparkCheckboxHandlerBound?: boolean
    _greensparkRemoveHandlerBound?: boolean
    _greensparkPreselectOptOut?: boolean
    _greensparkPreselectAddInProgress?: Record<string, boolean | undefined>
    _greensparkFetchIntercepted?: boolean
    _greensparkThemeEventsBound?: boolean
  }
}

export {}
