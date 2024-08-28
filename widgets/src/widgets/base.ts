import { DOMInjector } from '@/dom'
import type { ConnectionHandler } from '@/network'

export interface WidgetConfig {
  containerSelector: string
  api: ConnectionHandler
}

export interface WidgetTemplate {
  render(options?: unknown, containerSelector?: string): Promise<void>
  renderToString(options?: unknown): Promise<string>
  renderToNode(options?: unknown): Promise<Node>
}

export class Widget extends DOMInjector implements WidgetTemplate {
  api: ConnectionHandler

  constructor({ api, containerSelector }: WidgetConfig) {
    super({ containerSelector })
    this.api = api
  }

  render(): Promise<void> {
    throw new Error(`Greenspark - This widget does not support the 'render' method`)
  }

  renderToString(): Promise<string> {
    throw new Error(`Greenspark - This widget does not support the 'renderToString' method`)
  }

  renderToNode(): Promise<Node> {
    throw new Error(`Greenspark - This widget does not support the 'renderToNode' method`)
  }
}
