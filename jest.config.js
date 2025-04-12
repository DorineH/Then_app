// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
