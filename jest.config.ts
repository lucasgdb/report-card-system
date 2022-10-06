import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  transformIgnorePatterns: ['/node_modules/(?!@babel/runtime)', 'build'],
  testPathIgnorePatterns: ['node_modules', 'build'],
};

export default config;
