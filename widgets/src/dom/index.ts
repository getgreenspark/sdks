import { DEFAULT_CONTAINER_CSS_SELECTOR } from '@/constants'

export class DOMInjector {
  containerSelector: string

  constructor({ containerSelector }: { containerSelector: string }) {
    this.containerSelector = containerSelector
  }

  inject(widget: Node, containerSelector?: string) {
    this.containerSelector = containerSelector ?? this.containerSelector
    const container = document.querySelector(this.containerSelector)
    if (!container) {
      throw new Error(
        `Greenspark - The document.querySelector('${this.containerSelector}') does not return an Element. Are you sure that you input the correct 'containerSelector'? The default selector is ${DEFAULT_CONTAINER_CSS_SELECTOR}`,
      )
    }

    if (widget) {
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
      container.appendChild(widget)
    }
  }
}
