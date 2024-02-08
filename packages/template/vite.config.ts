import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [motionCanvas()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
