import { DEFAULT_CONTAINER_CSS_SELECTOR } from '@/constants'

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

  getWrapper(container: Element): ShadowRoot | Element {
    if (!this.useShadowDom) {
      return container
    }

    return container.shadowRoot ?? container.attachShadow({ mode: 'open' })
  }

  // Remove any previous Greenspark overlays for the same instance
  cleanupPreviousOverlay(instanceId: string) {
    const selector = `#gs-${instanceId}-widget-overlay`
    document.querySelectorAll(selector).forEach(el => el.remove())

    const shadowContainers = document.querySelectorAll('[data-greenspark-shadow-dom-container="true"]')
    shadowContainers.forEach(container => {
      const shadow = (container as HTMLElement).shadowRoot
      if (shadow) {
        shadow.querySelectorAll(selector).forEach(el => el.remove())
      }
    })
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

    // Find instanceId from widget HTML for cleanup
    const overlay = widget.querySelector('[id^="gs-"][id$="-widget-overlay"]')
    if (overlay?.id) {
      const match = overlay.id.match(/^gs-(.*)-widget-overlay$/)
      const instanceId = match ? match[1] : null
      if (instanceId) {
        this.cleanupPreviousOverlay(instanceId)
      }
    }

    container.setAttribute('data-greenspark-shadow-dom-container', 'true')
    const scripts = [...widget.children].filter((el) => el.tagName === 'SCRIPT')
    const nonScripts = [...widget.children].filter((el) => el.tagName !== 'SCRIPT')
    const wrapper = this.getWrapper(container)
    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild)
    }
    wrapper.append(...nonScripts)

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      scripts.forEach((s) => eval(s.innerHTML))
    } else {
      document.addEventListener('DOMContentLoaded', function() {
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
