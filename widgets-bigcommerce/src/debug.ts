const PREFIX = '[Greenspark BC]'

export function log(...args: unknown[]): void {
  // @ts-ignore
  console.log(PREFIX, ...args)
}

export function err(...args: unknown[]): void {
  console.error(PREFIX, ...args)
}

