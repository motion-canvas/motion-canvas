/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  rootDir: 'src',
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock', './setup.test.ts'],
  testPathIgnorePatterns: ['setup.test.ts'],
};
