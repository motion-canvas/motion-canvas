import css from '@motion-canvas/internal/rolldown/css.mjs';
import {defineConfig} from 'rolldown';

export default defineConfig({
  input: 'src/editor/index.ts',
  tsconfig: './src/editor/tsconfig.json',
  platform: 'browser',
  external: [/^@motion-canvas/, /^@?preact/],
  output: {
    dir: './editor',
    format: 'es',
    sourcemap: true,
  },
  plugins: [css()],
});
