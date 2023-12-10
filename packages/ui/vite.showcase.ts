import preact from '@preact/preset-vite';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.tsx',
      formats: ['es'],
      fileName: 'main',
    },
    outDir: '../docs/static/editor',
  },
  plugins: [preact()],
});
