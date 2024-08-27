import { createDefaultPreset } from 'ts-jest'

import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@fixtures/(.*)$': '<rootDir>/tests/fixtures/$1',
  },
  transform: {
    ...createDefaultPreset().transform,
  },
}

export default config
