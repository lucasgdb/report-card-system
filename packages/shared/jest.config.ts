import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  transform: {
    '^.+\\.(ts)$': 'babel-jest',
  },
  collectCoverageFrom: ['src/**/*.{ts}'],
  testEnvironment: 'node',
  setupFiles: ['core-js'],
};

export default config;
