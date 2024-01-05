import preact from '@preact/preset-vite';
import * as fs from 'fs';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '@motion-canvas/ui': '/src/main.tsx',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '@motion-canvas/2d/editor': '@motion-canvas/2d/src/editor',
    },
  },
  build: {
    lib: {
      entry: 'src/main.tsx',
      formats: ['es'],
      fileName: 'main',
    },
    rollupOptions: {
      external: [/^@motion-canvas\/core/, /^@?preact/],
    },
  },
  plugins: [
    preact(),
    dts({
      // NOTE: consider enabling it always once api-extractor can generate
      // declaration maps: https://github.com/microsoft/rushstack/issues/1886
      rollupTypes: process.env.CI === 'true',
    }),
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
