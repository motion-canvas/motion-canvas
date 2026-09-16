import motionCanvas from '@motion-canvas/vite-plugin';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [
    motionCanvas.default({
      project: ['./tests/project.ts'],
    }),
  ],
  test: {
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});
