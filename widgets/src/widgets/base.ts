import { DOMInjector } from '@/dom'
import type { ConnectionHandler } from '@/network'

export interface WidgetConfig {
  containerSelector: string
  api: ConnectionHandler
  useShadowDom?: boolean
}

export interface WidgetTemplate {
  render(options?: unknown, containerSelector?: string): Promise<void>
  renderToString(options?: unknown): Promise<string>
  renderToElement(options?: unknown): Promise<HTMLElement>
}

export class Widget extends DOMInjector implements WidgetTemplate {
  api: ConnectionHandler

  constructor({ api, containerSelector, useShadowDom }: WidgetConfig) {
    super({ containerSelector, useShadowDom })
    this.api = api
  }

  render(): Promise<void> {
    throw new Error(`Greenspark - This widget does not support the 'render' method`)
  }

  renderToString(): Promise<string> {
    throw new Error(`Greenspark - This widget does not support the 'renderToString' method`)
  }

  renderToElement(): Promise<HTMLElement> {
    throw new Error(`Greenspark - This widget does not support the 'renderToElement' method`)
  }
}
