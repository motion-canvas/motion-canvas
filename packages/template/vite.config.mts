import ffmpeg from '@motion-canvas/ffmpeg';
import markdown from '@motion-canvas/internal/vite/markdown-literals';
import motionCanvas from '@motion-canvas/vite-plugin';
import preact from '@preact/preset-vite';
import {defineConfig} from 'vite';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@motion-canvas/ui',
        replacement: '@motion-canvas/ui/src/main.tsx',
      },
      {
        find: '@motion-canvas/2d/editor',
        replacement: '@motion-canvas/2d/src/editor',
      },
      {
        find: '@motion-canvas/ffmpeg/lib/client',
        replacement: '@motion-canvas/ffmpeg/client',
      },
      {
        find: /@motion-canvas\/2d(\/lib)?/,
        replacement: '@motion-canvas/2d/src/lib',
      },
      {find: '@motion-canvas/core', replacement: '@motion-canvas/core/src'},
    ],
  },
  plugins: [
    markdown(),
    preact({
      include: [
        /packages\/ui\/src\/(.*)\.tsx?$/,
        /packages\/2d\/src\/editor\/(.*)\.tsx?$/,
      ],
    }),
    motionCanvas.default({
      buildForEditor: true,
    }),
    ffmpeg.default(),
  ],
  build: {
    minify: false,
    rolldownOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
