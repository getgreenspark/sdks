const PREFIX = '[Greenspark Shopify]'

export function err(...args: unknown[]): void {
  console.error(PREFIX, ...args)
}

export function warn(...args: unknown[]): void {
  console.warn(PREFIX, ...args)
}
