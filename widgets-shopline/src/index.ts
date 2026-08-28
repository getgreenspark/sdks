import { captureScriptEl } from './config'
import { err } from './debug'
import { scheduleRun } from './run'
import { TARGET_SELECTOR } from './selectors'

captureScriptEl(document.currentScript instanceof HTMLScriptElement ? document.currentScript : null)

function bootstrap(): void {
  const targets = [...document.querySelectorAll(TARGET_SELECTOR)]
  scheduleRun(targets.length > 0 ? targets : undefined)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true })
} else {
  bootstrap()
}

window.addEventListener('error', (event) => {
  if (event.filename?.includes('getgreenspark')) err('index: script error', event.error)
})
