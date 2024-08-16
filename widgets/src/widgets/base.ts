import type { ConnectionHandler } from '@/network'
import type { CartWidgetParams } from '@/interfaces'

export interface WidgetConfig {
  containerSelector: string
  api: ConnectionHandler
}

export class Widget {
  api: ConnectionHandler
  containerSelector: string

  constructor(config: WidgetConfig) {
    const { api, containerSelector } = config
    this.api = api
    this.containerSelector = containerSelector
  }

  render(containerSelector?: string, options?: unknown): void {
    throw new Error(`Greenspark - This widget does not support the 'render' method`)
  }

  renderToString(options?: unknown): string {
    throw new Error(`Greenspark - This widget does not support the 'renderToString' method`)
  }

  renderToElement(options?: unknown): Node {
    throw new Error(`Greenspark - This widget does not support the 'renderToElement' method`)
  }
}
