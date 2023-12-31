import motionCanvas from '@motion-canvas/vite-plugin';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [
    motionCanvas({
      buildForEditor: true,
    }),
  ],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
