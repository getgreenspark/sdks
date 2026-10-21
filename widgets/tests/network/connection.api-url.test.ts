import { GREENSPARK_API, resolveApiUrl } from '@/network/connection'

describe('resolveApiUrl', () => {
  test('pins the dev and prod hosts', () => {
    expect(GREENSPARK_API).toEqual({
      dev: 'https://dev-api.getmads.com',
      prod: 'https://api.getgreenspark.com',
    })
  })

  test('uses the prod host for a production build', () => {
    expect(resolveApiUrl(undefined, 'production')).toBe(GREENSPARK_API.prod)
  })

  test('uses the dev host for any other build mode', () => {
    expect(resolveApiUrl(undefined, 'development')).toBe(GREENSPARK_API.dev)
    expect(resolveApiUrl(undefined, 'test')).toBe(GREENSPARK_API.dev)
    expect(resolveApiUrl(undefined, undefined)).toBe(GREENSPARK_API.dev)
  })

  test('prefers an explicit apiUrl over the build default', () => {
    expect(resolveApiUrl('https://example.test', 'production')).toBe('https://example.test')
    expect(resolveApiUrl('https://example.test', 'development')).toBe('https://example.test')
  })

  test('ignores an empty apiUrl', () => {
    expect(resolveApiUrl('', 'production')).toBe(GREENSPARK_API.prod)
  })
})
