import { widgetUrl } from './config'

export function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${url}`))
    script.src = url
    const head = document.querySelector('head')
    if (head) head.appendChild(script)
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
    window.dispatchEvent(new Event('greenspark-bigcommerce-setup'))
  } catch (error) {
    console.error('Greenspark Widget (BigCommerce) - Failed to load script:', error)
    setTimeout(() => setup(), 1000)
  }
}
