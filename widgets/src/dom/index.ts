import { DEFAULT_CONTAINER_CSS_SELECTOR } from '@/constants'

export class DOMInjector {
  containerSelector: string

  constructor({ containerSelector }: { containerSelector: string }) {
    this.containerSelector = containerSelector
  }

  inject(widget: HTMLElement, containerSelector?: string) {
    if (!widget) return

    this.containerSelector = containerSelector ?? this.containerSelector
    const container = document.querySelector(this.containerSelector)
    if (!container) {
      throw new Error(
        `Greenspark - The document.querySelector('${this.containerSelector}') does not return an Element. Are you sure that you input the correct 'containerSelector'? The default selector is ${DEFAULT_CONTAINER_CSS_SELECTOR}`,
      )
    }

    container.setAttribute('data-greenspark-shadow-dom-container', 'true')
    while (container?.shadowRoot?.firstChild) {
      container.shadowRoot.removeChild(container.shadowRoot.firstChild)
    }
    const scripts = [...widget.children].filter((el) => el.tagName === 'SCRIPT')
    const nonScripts = [...widget.children].filter((el) => el.tagName !== 'SCRIPT')
    const shadow = container.shadowRoot ?? container.attachShadow({ mode: 'open' })
    shadow.append(...nonScripts)

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
