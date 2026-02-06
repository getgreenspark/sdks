import { log } from './debug'

const popupHistory: HTMLElement[] = []

export function getWidgetContainer(widgetId: string): string {
  const targetId = widgetId.replace(/[^a-z0-9_-]/gi, '-').toLowerCase()
  const containerSelector = `[data-greenspark-widget-container-for="${targetId}"]`
  const target = document.getElementById(widgetId)
  if (!target) {
    log('dom: getWidgetContainer – no element with id', widgetId, 'returning selector', containerSelector)
    return containerSelector
  }
  const el = target.querySelector(containerSelector) as HTMLElement | null
  if (!el) {
    log('dom: getWidgetContainer – creating .greenspark-widget-instance for', widgetId)
    target.querySelectorAll('.greenspark-widget-instance').forEach((e) => e.remove())
    target.insertAdjacentHTML(
      'afterbegin',
      `<div class="greenspark-widget-instance" data-greenspark-widget-container-for="${targetId}"></div>`,
    )
  }
  return containerSelector
}

export function movePopupToBody(widgetId: string): void {
  popupHistory.forEach((popup) => {
    popup.innerHTML = ''
    popup.style.display = 'none'
  })
  const parent = document.getElementById(widgetId)
  const popup = parent?.querySelector<HTMLElement>('div[class^="gs-popup-"]')
  if (popup) {
    document.body.append(popup)
    popupHistory.push(popup)
    log('dom: movePopupToBody – moved popup for', widgetId, 'to body')
  } else {
    log('dom: movePopupToBody – no gs-popup-* found inside', widgetId)
  }
}
