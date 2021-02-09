export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/test/**/*.ts'
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {
    '.+\\.ts$':'ts-jest'
  }
};
