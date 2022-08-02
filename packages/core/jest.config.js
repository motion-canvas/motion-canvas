/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  rootDir: 'src',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  globals: {
    CORE_VERSION: '1.0.0',
    PROJECT_FILE_NAME: 'tests',
    META_VERSION: 1,
  },
};
