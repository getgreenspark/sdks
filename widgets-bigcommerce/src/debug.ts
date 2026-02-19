const PREFIX = '[Greenspark BC]'

export function err(...args: unknown[]): void {
  console.error(PREFIX, ...args)
}

