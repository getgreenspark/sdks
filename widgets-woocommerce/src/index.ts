import { err } from './debug'
import { setup } from './script-loader'
import { runGreenspark } from './run'

setup().catch((e) => {
  err('index: setup failed', e)
})

if (typeof window !== 'undefined') {
  if (!window.GreensparkWidgets) {
    window.addEventListener('widgets-woocommerce-setup', () => runGreenspark(), { once: true })
  } else {
    runGreenspark()
  }
}
