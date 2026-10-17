/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^@bahi/database$': '<rootDir>/packages/database/src/index.ts',
    '^@bahi/types$': '<rootDir>/packages/types/src/index.ts',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ES2022',
          module: 'commonjs',
          moduleResolution: 'node',
          esModuleInterop: true,
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          skipLibCheck: true,
        },
      },
    ],
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/.next/'],
};
