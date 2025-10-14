/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ['**/test/**/*.test.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/', 
    '/src/generated/prisma/'
  ],
};
