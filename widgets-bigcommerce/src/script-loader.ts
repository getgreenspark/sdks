import { err } from './debug'
import { widgetUrl } from './config'

const MAX_SCRIPT_RETRIES = 5
let scriptRetryCount = 0

export function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = () => resolve()
    script.onerror = () => {
      err('script-loader: script failed to load', url)
      reject(new Error(`Failed to load ${url}`))
    }
    script.src = url
    const head = document.querySelector('head')
    if (head) {
      head.appendChild(script)
    } else {
      err('script-loader: no <head> found, cannot inject script')
      reject(new Error('No head element'))
    }
  })
}

export async function setup(): Promise<void> {
  if (typeof window === 'undefined' || window.GreensparkWidgets) return
  if (document.readyState === 'loading') {
    return new Promise<void>((resolve) => {
      document.addEventListener('DOMContentLoaded', () => setup().then(resolve), { once: true })
    })
  }
  try {
    await loadScript(widgetUrl)
    scriptRetryCount = 0
    window.dispatchEvent(new Event('greenspark-bigcommerce-setup'))
  } catch (error) {
    if (scriptRetryCount >= MAX_SCRIPT_RETRIES) {
      err('script-loader: gave up after', MAX_SCRIPT_RETRIES, 'retries', error)
      return
    }
    scriptRetryCount += 1
    err('script-loader: Failed to load script, will retry in 1s', error)
    setTimeout(() => setup(), 1000)
  }
}
