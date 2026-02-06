import { log, err } from './debug'
import { widgetUrl } from './config'

export function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    log('script-loader: loading script', url)
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = () => {
      log('script-loader: script loaded successfully', url)
      resolve()
    }
    script.onerror = () => {
      err('script-loader: script failed to load', url)
      reject(new Error(`Failed to load ${url}`))
    }
    script.src = url
    const head = document.querySelector('head')
    if (head) {
      head.appendChild(script)
      log('script-loader: script tag appended to head')
    } else {
      err('script-loader: no <head> found, cannot inject script')
      reject(new Error('No head element'))
    }
  })
}

export async function setup(): Promise<void> {
  log('script-loader: setup() called, document.readyState =', document?.readyState)
  if (typeof window === 'undefined' || window.GreensparkWidgets) {
    log('script-loader: skipping (window undefined or GreensparkWidgets already present)')
    return
  }
  if (document.readyState === 'loading') {
    log('script-loader: DOM still loading, waiting for DOMContentLoaded')
    return new Promise<void>((resolve) => {
      document.addEventListener('DOMContentLoaded', () => {
        log('script-loader: DOMContentLoaded fired, calling setup() again')
        setup().then(resolve)
      }, { once: true })
    })
  }
  try {
    log('script-loader: fetching core widgets from', widgetUrl)
    await loadScript(widgetUrl)
    log('script-loader: dispatching greenspark-bigcommerce-setup')
    window.dispatchEvent(new Event('greenspark-bigcommerce-setup'))
  } catch (error) {
    err('script-loader: Failed to load script, will retry in 1s', error)
    setTimeout(() => setup(), 1000)
  }
}
