import {defineConfig} from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.tsx',
      formats: ['es'],
      fileName: 'main',
    },
    rollupOptions: {
      external: ['@motion-canvas/core'],
    },
  },
  plugins: [preact()],
});
