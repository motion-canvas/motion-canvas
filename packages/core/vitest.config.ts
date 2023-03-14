import {defineConfig} from 'vitest/config';
import markdownLiterals from '@motion-canvas/internal/vite/markdown-literals';

export default defineConfig({
  plugins: [markdownLiterals()],
  test: {
    environment: 'jsdom',
  },
});
