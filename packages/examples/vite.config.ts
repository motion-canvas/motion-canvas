import motionCanvas from '@motion-canvas/vite-plugin';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [
    motionCanvas({
      project: [
        './src/quickstart.ts',
        './src/tex.ts',
        './src/tweening-linear.ts',
        './src/tweening-cubic.ts',
        './src/tweening-color.ts',
        './src/tweening-vector.ts',
        './src/tweening-visualiser.ts',
        './src/node-signal.ts',
        './src/code-block.ts',
        './src/code.ts',
        './src/random.ts',
        './src/layout.ts',
        './src/layout-group.ts',
        './src/positioning.ts',
        './src/media-image.ts',
        './src/media-video.ts',
        './src/components.ts',
        './src/logging.ts',
        './src/transitions.ts',
        './src/tweening-spring.ts',
        './src/tweening-save-restore.ts',
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
