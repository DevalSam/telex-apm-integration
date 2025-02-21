
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.test.ts', // Only pick up files ending with .test.ts
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/helpers/', // Exclude test helpers from coverage
  ],
  collectCoverageFrom: [
    'src/**/*.ts', // Collect coverage from all .ts files in src
    '!src/**/*.d.ts', // Exclude TypeScript declaration files
    '!src/**/index.ts', // Exclude index files (if needed)
  ],
};
