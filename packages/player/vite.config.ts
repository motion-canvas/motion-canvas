import {defineConfig} from 'vite';
import * as fs from 'fs';

export default defineConfig({
  build: {
    minify: 'esbuild',
    lib: {
      entry: 'src/main.ts',
      formats: ['es'],
      fileName: 'main',
    },
    rollupOptions: {
      external: ['@motion-canvas/core'],
    },
  },
  plugins: [
    {
      name: 'template',
      load(id) {
        if (id === '\0virtual:template') {
          return fs.readFileSync('../template/dist/project.js').toString();
        }
      },
    },
  ],
});
