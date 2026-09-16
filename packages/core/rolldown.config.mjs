import markdownLiterals from '@motion-canvas/internal/rolldown/markdown-literals.mjs';
import {defineConfig} from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  tsconfig: './tsconfig.json',
  platform: 'browser',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true,
    minify: true,
  },
  plugins: [markdownLiterals()],
});
