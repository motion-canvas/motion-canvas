/// <reference types="vitest" />

import motionCanvas from '@motion-canvas/vite-plugin';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [
    motionCanvas.default({
      project: ['@motion-canvas/template/src/project.ts'],
    }),
  ],
  test: {
    testTimeout: 60000,
  },
});
