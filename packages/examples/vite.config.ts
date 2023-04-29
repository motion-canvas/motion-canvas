import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [
    motionCanvas({
      project: [
        './src/quickstart.ts',
        './src/code-block.ts',
        './src/random.ts',
        './src/layout.ts',
        './src/positioning.ts',
        './src/media-video.ts',
        './src/components.ts',
        './src/logging.ts',
        './src/transitions.ts',
        './src/presentation.ts',
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
