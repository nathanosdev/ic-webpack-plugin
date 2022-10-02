module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/configure-jest.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        compiler: 'ttypescript',
      },
    ],
  },
  rootDir: 'src',
  collectCoverageFrom: ['**/*.ts', '!main.ts', '!typings.d.ts'],
  coverageDirectory: '<rootDir>/../coverage',
  reporters: [
    'default',
    'github-actions',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/../reports',
        outputName: 'report.xml',
      },
    ],
  ],
};
