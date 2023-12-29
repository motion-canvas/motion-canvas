import * as fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
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
