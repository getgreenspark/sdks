import { err } from './debug'
import { scheduleRun } from './run'
import { TARGET_SELECTOR } from './selectors'

const scriptSrc = document.currentScript?.getAttribute('src')

function bootstrap(): void {
  if (!scriptSrc) return

  const targets = [...document.querySelectorAll(TARGET_SELECTOR)]
  if (targets.length > 0) scheduleRun(targets)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true })
} else {
  bootstrap()
}

window.addEventListener('error', (event) => {
  if (event.filename?.includes('getgreenspark')) err('index: script error', event.error)
})
