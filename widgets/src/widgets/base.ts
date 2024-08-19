import type { ConnectionHandler } from '@/network'
import type { CartWidgetParams } from '@/interfaces'

export interface WidgetConfig {
  containerSelector: string
  api: ConnectionHandler
}

export class Widget {
  api: ConnectionHandler
  containerSelector: string

  constructor({ api, containerSelector }: WidgetConfig) {
    this.api = api
    this.containerSelector = containerSelector
  }

  render(options?: unknown, containerSelector?: string): Promise<void> {
    throw new Error(`Greenspark - This widget does not support the 'render' method`)
  }

  renderToString(options?: unknown): Promise<string> {
    throw new Error(`Greenspark - This widget does not support the 'renderToString' method`)
  }

  renderToNode(options?: unknown): Promise<Node> {
    throw new Error(`Greenspark - This widget does not support the 'renderToNode' method`)
  }
}
