import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescriptBase from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import markdownLiterals from '../transformers/markdown-literals.js';

function typescript() {
  return typescriptBase({
    compilerOptions: {
      declaration: false,
      declarationMap: false,
    },
    transformers: {
      before: [
        {
          type: 'program',
          factory: markdownLiterals,
        },
      ],
    },
  });
}

export default function makeConfig(config = {}) {
  const {output = {}, plugins = [], ...rest} = config;
  return [
    {
      input: 'src/index.ts',
      output: [
        {
          file: 'dist/index.js',
          format: 'es',
          sourcemap: true,
          ...output,
        },
        {
          file: 'dist/index.min.js',
          format: 'es',
          ...output,
          plugins: [terser()],
        },
      ],
      plugins: [...plugins, resolve(), commonjs(), typescript()],
      ...rest,
    },
  ];
}
