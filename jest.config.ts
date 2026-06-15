import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', 'setup\\.ts$', 'testUtils\\.tsx$'],
  moduleNameMapper: {
    '^.+\\.module\\.(scss|css)$': '<rootDir>/src/__mocks__/styleMock.ts',
    '^.+\\.(scss|css)$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        lib: ['ES2017', 'DOM'],
        types: ['jest', '@testing-library/jest-dom'],
        paths: {},
      },
      diagnostics: false,
    }],
  },
};

export default config;
