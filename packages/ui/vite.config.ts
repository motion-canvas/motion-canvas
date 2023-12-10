import preact from '@preact/preset-vite';
import * as fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.tsx',
      formats: ['es'],
      fileName: 'main',
    },
    rollupOptions: {
      external: [/^@motion-canvas\/core/],
    },
  },
  plugins: [
    preact(),
    {
      name: 'copy-files',
      async buildStart() {
        this.emitFile({
          type: 'asset',
          fileName: 'editor.html',
          source: await fs.promises.readFile('./editor.html'),
        });
      },
    },
  ],
});
