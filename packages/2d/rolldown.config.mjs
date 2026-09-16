import markdownLiterals from '@motion-canvas/internal/rolldown/markdown-literals.mjs';
import {defineConfig} from 'rolldown';

export default defineConfig({
  input: 'src/lib/index.ts',
  tsconfig: './src/lib/tsconfig.json',
  platform: 'browser',
  external: [/^@motion-canvas\/core/],
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true,
    minify: true,
  },
  plugins: [markdownLiterals()],
});
