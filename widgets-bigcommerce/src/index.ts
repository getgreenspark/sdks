import { err, log } from './debug'
import { setup } from './script-loader'
import { runGreenspark } from './run'

log('index: script loaded')

setup().catch((e) => {
  err('index: setup failed', e)
})

if (typeof window !== 'undefined') {
  if (!window.GreensparkWidgets) {
    log('index: GreensparkWidgets not yet available, waiting for greenspark-bigcommerce-setup event')
    window.addEventListener('greenspark-bigcommerce-setup', () => {
      log('index: received greenspark-bigcommerce-setup, calling runGreenspark')
      runGreenspark()
    }, { once: true })
  } else {
    log('index: GreensparkWidgets already on window, calling runGreenspark immediately')
    runGreenspark()
  }
} else {
  log('index: window undefined (SSR?), skipping run')
}
