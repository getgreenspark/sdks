const POPUP_SELECTOR = '.gs-popup, div[class^="gs-popup-"]'

// Key by target id: drawer refreshes replace the HTMLElement, but the id is stable.
const ownedPopups = new Map<string, HTMLElement>()

export function preparePopupMedia(root: ParentNode): void {
  root.querySelectorAll<HTMLImageElement>(`${POPUP_SELECTOR} img`).forEach((img) => {
    img.loading = 'lazy'
    img.decoding = 'async'
  })
}

/** Instance id is the element's unique DOM id, which may differ from the Greenspark widget id. */
export function widgetInstanceId(target: HTMLElement): string {
  return target.id.replace(/[^a-z0-9_-]/gi, '-').toLowerCase()
}

export function getWidgetContainer(target: HTMLElement): string {
  const instanceId = widgetInstanceId(target)
  const containerSelector = `[data-greenspark-widget-container-for="${instanceId}"]`
  const el = target.querySelector(containerSelector) as HTMLElement | null
  if (!el) {
    target.querySelectorAll('.greenspark-widget-instance').forEach((node) => node.remove())
    target.insertAdjacentHTML(
      'afterbegin',
      `<div class="greenspark-widget-instance" data-greenspark-widget-container-for="${instanceId}"></div>`,
    )
  }
  return containerSelector
}

export function cleanupOwnedPopup(target: HTMLElement): void {
  const key = target.id
  if (!key) return
  const popup = ownedPopups.get(key)
  if (!popup) return
  popup.innerHTML = ''
  popup.style.display = 'none'
  popup.remove()
  ownedPopups.delete(key)
}

/** Empty carts must not leave widget HTML; keep the mount node for the next refresh. */
export function clearWidgetMount(target: HTMLElement): void {
  cleanupOwnedPopup(target)
  target.innerHTML = ''
}

export function movePopupToBody(target: HTMLElement): void {
  cleanupOwnedPopup(target)
  const popup = target.querySelector<HTMLElement>('div[class^="gs-popup-"], .gs-popup')
  if (popup) {
    preparePopupMedia(popup)
    document.body.append(popup)
    if (target.id) ownedPopups.set(target.id, popup)
  }
}

export function injectWidgetStyles(): void {
  if (document.getElementById('greenspark-widget-style')) return
  const style = document.createElement('style')
  style.id = 'greenspark-widget-style'
  style.textContent = `
    .greenspark-widget-target {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px 0;
    }
  `
  document.head.appendChild(style)
}
