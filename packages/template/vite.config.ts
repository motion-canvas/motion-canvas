import markdown from '@motion-canvas/internal/vite/markdown-literals';
import preact from '@preact/preset-vite';
import {defineConfig} from 'vite';
import ffmpeg from '../ffmpeg/server';
import motionCanvas from '../vite-plugin/src/main';

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
    motionCanvas({
      buildForEditor: true,
    }),
    ffmpeg(),
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
