import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [
    motionCanvas.default({
      project: [`@motion-canvas/template/src/${process.argv[2]}.ts`],
      editor: '@motion-canvas/renderer',
      editorFileName: '../renderer.html',
    }),
  ],
});
