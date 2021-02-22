module.exports = {
  roots: ['<rootDir>/test', '<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/test/**/*.ts',
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.d.ts',
    '!**/index.*',
    '!<rootDir>/src/main/server.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
