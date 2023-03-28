import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [
    motionCanvas.default({
      project: ['@motion-canvas/template/src/project.ts'],
      editor: '@motion-canvas/renderer',
      editorFileName: '../renderer.html',
    }),
  ],
});
