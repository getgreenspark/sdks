import { DEFAULT_CONTAINER_CSS_SELECTOR } from '@/constants'
import type { LayoutConfig } from '@/interfaces'

export class DOMInjector {
  containerSelector: string
  useShadowDom?: boolean

  constructor({
    containerSelector,
    useShadowDom = true,
  }: {
    containerSelector: string
    useShadowDom?: boolean
  }) {
    this.containerSelector = containerSelector
    this.useShadowDom = useShadowDom
  }

  static getLayoutClasses(layout: Partial<LayoutConfig>): string[] {
    const { horizontalAlignment, size, justifyContent } = layout
    return [
      horizontalAlignment ? `gs-horizontal-alignment-${horizontalAlignment}` : null,
      size ? `gs-size-${size}` : null,
      justifyContent ? `gs-justify-content-${justifyContent}` : null,
    ].filter<string>((v) => v !== null)
  }

  getWrapper(container: Element): ShadowRoot | Element {
    if (!this.useShadowDom) {
      return container
    }

    return container.shadowRoot ?? container.attachShadow({ mode: 'open' })
  }

  inject(widget: HTMLElement, containerSelector?: string, layout?: Partial<LayoutConfig>) {
    if (!widget) return

    this.containerSelector = containerSelector ?? this.containerSelector
    const container = document.querySelector(this.containerSelector)
    if (!container) {
      throw new Error(
        `Greenspark - The document.querySelector('${this.containerSelector}') does not return an Element. Are you sure that you input the correct 'containerSelector'? The default selector is ${DEFAULT_CONTAINER_CSS_SELECTOR}`,
      )
    }

    container.setAttribute('data-greenspark-shadow-dom-container', 'true')
    const scripts = [...widget.children].filter((el) => el.tagName === 'SCRIPT')
    const nonScripts = [...widget.children].filter((el) => el.tagName !== 'SCRIPT')
    const wrapper = this.getWrapper(container)
    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild)
    }
    wrapper.append(...nonScripts)

    if (layout) {
      const widgetContainer = wrapper.querySelector('.root-container')
      if (widgetContainer) widgetContainer.classList.add(...DOMInjector.getLayoutClasses(layout))
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      scripts.forEach((s) => eval(s.innerHTML))
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        scripts.forEach((s) => eval(s.innerHTML))
      })
    }
  }

  parseHtml(html: string): HTMLElement {
    const parser = new DOMParser()
    const parsedWidget = parser.parseFromString(html, 'text/html')
    if (parsedWidget.body === null) {
      throw new Error(
        `Greenspark - An error occurred when trying to execute 'renderToElement'. Failed to render ${html} `,
      )
    }
    return parsedWidget.body
  }
}
