import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
  transformIgnorePatterns: ['/node_modules/(?!@babel/runtime)', 'build'],
  testPathIgnorePatterns: ['node_modules', 'build'],
};

export default config;
