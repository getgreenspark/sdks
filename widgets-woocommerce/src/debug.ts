const PREFIX = '[Greenspark WC]'

export function log(...args: unknown[]): void {
  console.log(PREFIX, ...args)
}

export function err(...args: unknown[]): void {
  console.error(PREFIX, ...args)
}
