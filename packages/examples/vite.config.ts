import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [
    motionCanvas({
      project: [
        './src/quickstart.ts',
        './src/tweening-linear.ts',
        './src/tweening-cubic.ts',
        './src/tweening-color.ts',
        './src/tweening-vector.ts',
        './src/random.ts',
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        dir: '../docs/static/examples',
        entryFileNames: '[name].js',
      },
    },
  },
});
