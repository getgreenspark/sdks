const PREFIX = '[Greenspark BC]'

/** Dev-only debug logging; allowed by ESLint for troubleshooting. */
export function log(...args: unknown[]): void {
  console.log(PREFIX, ...args)
}

export function err(...args: unknown[]): void {
  console.error(PREFIX, ...args)
}

