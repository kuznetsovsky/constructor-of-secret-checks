/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const jestConfig: Config = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./tests/setup-tests.ts']
}

export default jestConfig
