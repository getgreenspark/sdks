export const GREENSPARK_API = {
  dev: 'https://inquirable-posttracheal-heaven.ngrok-free.dev',
  prod: 'https://api.getgreenspark.com',
} as const

export function isDevStore(context: string): boolean {
  return context.includes('greenspark-development-store')
}

export function getGreensparkApiUrl(shopUniqueName: string): string {
  return isDevStore(shopUniqueName) ? GREENSPARK_API.dev : GREENSPARK_API.prod
}
