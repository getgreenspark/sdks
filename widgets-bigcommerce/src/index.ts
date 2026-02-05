import { setup } from './script-loader'
import { runGreenspark } from './run'

setup().catch((e) => console.error('Greenspark Widget (BigCommerce) -', e))

if (typeof window !== 'undefined') {
  if (!window.GreensparkWidgets) {
    window.addEventListener('greenspark-bigcommerce-setup', runGreenspark, { once: true })
  } else {
    runGreenspark()
  }
}
