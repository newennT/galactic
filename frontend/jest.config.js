// jest.config.js

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/core/models/**',
    '!src/main.ts',
    '!src/environments/**',
    '!src/app/**/index.ts',
    '!src/app/**/*.routing.module.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.resolver.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text']
};