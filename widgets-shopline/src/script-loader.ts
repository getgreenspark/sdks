import { getShopUniqueName, isGsDevStore } from './config'
import { err } from './debug'

function widgetSdkUrl(): string {
  const context = `${getShopUniqueName()} ${window.location.hostname}`
  return isGsDevStore(context)
    ? 'https://cdn.getgreenspark.com/scripts/widgets%402.6.3.js'
    : 'https://cdn.getgreenspark.com/scripts/widgets%40latest.js'
}

const MAX_SCRIPT_RETRIES = 5
const SCRIPT_LOADED_ATTRIBUTE = 'data-greenspark-loaded'

let setupPromise: Promise<void> | null = null
let scriptRetryCount = 0

export function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${url}"]`)
    if (existing) {
      if (window.GreensparkWidgets || existing.getAttribute(SCRIPT_LOADED_ATTRIBUTE) === 'true') {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${url}`)), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = url
    script.onload = () => {
      script.setAttribute(SCRIPT_LOADED_ATTRIBUTE, 'true')
      resolve()
    }
    script.onerror = () => {
      err('script-loader: script failed to load', url)
      reject(new Error(`Failed to load ${url}`))
    }

    const head = document.querySelector('head')
    if (head) {
      head.appendChild(script)
      return
    }

    reject(new Error('No head element'))
  })
}

export function setup(): Promise<void> {
  if (typeof window === 'undefined' || window.GreensparkWidgets) return Promise.resolve()
  if (setupPromise) return setupPromise

  setupPromise = loadScript(widgetSdkUrl())
    .then(() => {
      scriptRetryCount = 0
      window.dispatchEvent(new Event('greenspark-shopline-setup'))
    })
    .catch((error: unknown) => {
      setupPromise = null
      if (scriptRetryCount >= MAX_SCRIPT_RETRIES) {
        err('script-loader: gave up after', MAX_SCRIPT_RETRIES, 'retries', error)
        return
      }
      scriptRetryCount += 1
      err('script-loader: failed to load script, will retry in 1s', error)
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setup().then(resolve)
        }, 1000)
      })
    })

  return setupPromise
}
