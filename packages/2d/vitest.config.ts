import markdownLiterals from '@motion-canvas/internal/vite/markdown-literals';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [markdownLiterals()],
  test: {
    include: ['./src/lib/**/*.test.*'],
    environment: 'jsdom',
  },
});
