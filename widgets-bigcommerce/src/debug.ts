/** Console logging for debugging. Filter in DevTools by "[Greenspark BC]". */
const PREFIX = '[Greenspark BC]'

export function log(...args: unknown[]): void {
  // eslint-disable-next-line no-console
  console.log(PREFIX, ...args)
}

export function warn(...args: unknown[]): void {
  console.warn(PREFIX, ...args)
}

export function err(...args: unknown[]): void {
  console.error(PREFIX, ...args)
}
