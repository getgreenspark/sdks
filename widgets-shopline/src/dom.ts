const POPUP_SELECTOR = '.gs-popup, div[class^="gs-popup-"]'

const ownedPopups = new WeakMap<HTMLElement, HTMLElement>()

export function preparePopupMedia(root: ParentNode): void {
  root.querySelectorAll<HTMLImageElement>(`${POPUP_SELECTOR} img`).forEach((img) => {
    img.loading = 'lazy'
    img.decoding = 'async'
  })
}

/** Instance id is the element's unique DOM id, which may differ from the Greenspark widget id. */
export function getWidgetContainer(target: HTMLElement): string {
  const instanceId = target.id.replace(/[^a-z0-9_-]/gi, '-').toLowerCase()
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
  const popup = ownedPopups.get(target)
  if (!popup) return
  popup.innerHTML = ''
  popup.style.display = 'none'
  popup.remove()
  ownedPopups.delete(target)
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
    ownedPopups.set(target, popup)
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
