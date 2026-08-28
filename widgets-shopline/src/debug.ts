import { getShopUniqueName, isGsDevStore } from './config'

const PREFIX = '[Greenspark Shopline]'

/** Same QA gate as API/SDK routing. Merchant storefronts stay quiet. */
export function isDebugEnabled(slug: string): boolean {
  return isGsDevStore(slug)
}

export function log(...args: unknown[]): void {
  if (!isDebugEnabled(getShopUniqueName())) return
  console.log(PREFIX, ...args)
}

export function err(...args: unknown[]): void {
  console.error(PREFIX, ...args)
}

export function warn(...args: unknown[]): void {
  console.warn(PREFIX, ...args)
}
