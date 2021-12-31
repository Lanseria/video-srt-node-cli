import type { InitialOptionsTsJest } from 'ts-jest';
const config: InitialOptionsTsJest = {
  'preset': 'ts-jest',
  'testEnvironment': 'node',
  'moduleFileExtensions': ['js', 'json', 'ts'],
  'rootDir': '.',
  'testRegex': '.spec.ts$',
  'transform': {
    '^.+\\.ts$': 'ts-jest',
  },
  'coverageDirectory': './coverage',
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
export default config;
