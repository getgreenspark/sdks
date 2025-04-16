import { EnumToWidgetTypeMap } from './interfaces'

const scriptSrc = document.currentScript?.getAttribute('src')
const widgetUrl = 'https://cdn.getgreenspark.com/scripts/widgets%402.0.1-2.js' // TODO: set it to latest
const popupHistory: HTMLElement[] = []

function runGreenspark() {
  if (!scriptSrc) {
    return
  }

  const useShadowDom = false
  const version = 'v2'

  // eslint-disable-next-line no-console
  console.log('origin', window.origin)
  const locale = window.navigator.language
  const greenspark = new window.GreensparkWidgets({
    locale,
    origin: window.origin,
  })


  const renderStats = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.topStatsById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget.render().then(movePopupToBody).catch((e) => {
      if (!e.response) return console.error('Greenspark Widget - ', e)
    })
  }

  const renderStatic = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.staticById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget.render().then(movePopupToBody).catch((e) => {
      if (!e.response) return console.error('Greenspark Widget - ', e)
    })
  }

  const renderBanner = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.fullWidthBannerById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget.render().then(movePopupToBody).catch((e) => {
      if (!e.response) return console.error('Greenspark Widget - ', e)
    })
  }

  const movePopupToBody = () => {
    popupHistory.forEach((outdatedPopup) => {
      outdatedPopup.innerHTML = ''
      outdatedPopup.style.display = 'none'
    })

    const popup = document.querySelector('.gs-popup') as HTMLElement | null
    if (popup) {
      document.body.append(popup)
      popupHistory.push(popup)
    }
  }

  const targets = document.querySelectorAll('.greenspark-widget-target')

  // Add styles for widget targets
  const style = document.createElement('style')
  style.textContent = `
    .greenspark-widget-target {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 8px 0;
    }
  `
  document.head.appendChild(style)

  targets.forEach(target => {
    // Remove any previously injected containers
    target.querySelectorAll('.greenspark-widget-instance').forEach(el => el.remove())

    const randomId = crypto.randomUUID()
    let type: string
    try {
      [type] = atob(target.id).split('|')
    } catch {
      console.error('Invalid widget ID encoding:', target.id)
      return
    }

    const variant = EnumToWidgetTypeMap[type]
    const containerSelector = `[data-greenspark-widget-target-${randomId}]`
    target.insertAdjacentHTML('afterbegin', `<div class="greenspark-widget-instance" data-greenspark-widget-target-${randomId}></div>`)

    if (variant === 'stats') renderStats(target.id, containerSelector)
    if (variant === 'static') renderStatic(target.id, containerSelector)
    if (variant === 'banner') renderBanner(target.id, containerSelector)
  })
}

function loadScript(url: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = function() {
      resolve()
    }

    script.src = url
    const head = document.querySelector('head')

    if (head) {
      head.appendChild(script)
    }
  })
}

async function setup() {
  if (window.GreensparkWidgets) return
  await loadScript(widgetUrl)
  window.dispatchEvent(new Event('greenspark-setup'))
}

setup().catch((e) => console.error('Greenspark Widget -', e))

if (!window.GreensparkWidgets) {
  window.addEventListener('greenspark-setup', runGreenspark, { once: true })
} else {
  runGreenspark()
}
