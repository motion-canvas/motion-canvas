/// <reference types="vitest" />

import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

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
