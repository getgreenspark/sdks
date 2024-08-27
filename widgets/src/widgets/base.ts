import type { ConnectionHandler } from '@/network'

export interface WidgetConfig {
  containerSelector: string
  api: ConnectionHandler
}

interface WidgetTemplate {
  render(options?: unknown, containerSelector?: string): Promise<void>
  renderToString(options?: unknown): Promise<string>
  renderToNode(options?: unknown): Promise<Node>
}

export class Widget implements WidgetTemplate {
  api: ConnectionHandler
  containerSelector: string

  constructor({ api, containerSelector }: WidgetConfig) {
    this.api = api
    this.containerSelector = containerSelector
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
