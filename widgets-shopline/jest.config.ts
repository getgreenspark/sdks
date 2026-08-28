import { createDefaultPreset } from 'ts-jest'

import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  // Keep tests out of src so webpack never sees them in the compile graph.
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  transform: {
    ...createDefaultPreset({ isolatedModules: true }).transform,
  },
}

export default config
