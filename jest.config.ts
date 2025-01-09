import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@slices(.*)$': '<rootDir>/src/services/slices$1'
  },
};

export default config;
