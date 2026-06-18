export const GREENSPARK_API = {
  dev: 'https://dev-api.getmads.com',
  prod: 'https://api.getgreenspark.com',
} as const

export function isGreensparkDevStore(context: string): boolean {
  return context.includes('greenspark-development-store')
}

export function getGreensparkApiUrl(shopUniqueName: string): string {
  return isGreensparkDevStore(shopUniqueName) ? GREENSPARK_API.dev : GREENSPARK_API.prod
}
