import { DOMInjector } from '@/dom'
import type { ConnectionHandler } from '@/network'

export interface WidgetConfig {
  containerSelector: string
  api: ConnectionHandler
}

export interface WidgetTemplate {
  render(options?: unknown, containerSelector?: string): Promise<void>
  renderToString(options?: unknown): Promise<string>
  renderToElement(options?: unknown): Promise<HTMLElement>
}

export class Widget extends DOMInjector implements WidgetTemplate {
  api: ConnectionHandler

  constructor({ api, containerSelector }: WidgetConfig) {
    super({ containerSelector })
    this.api = api
  }

  async render(options?: unknown, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  renderToString(options: unknown): Promise<string> {
    throw new Error(`Greenspark - This widget does not support the 'renderToString' method`)
  }

  async renderToElement(options?: unknown): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
