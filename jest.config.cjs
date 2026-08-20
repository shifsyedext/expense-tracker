module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts',
  ],

  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
  ],

  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
  ],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$':
      '<rootDir>/src/testStyleMock.cjs',
  },

  clearMocks: true,
};