/* eslint-disable @typescript-eslint/naming-convention */
import * as Babel from '@babel/standalone';
import runtime from '@site/src/components/Fiddle/runtime';

Babel.registerPlugin('mc', ({types}) => ({
  visitor: {
    Program(path) {
      path.node.body.unshift(
        types.variableDeclaration('const', [
          types.variableDeclarator(
            types.objectPattern(
              Object.keys(runtime).map(key =>
                types.objectProperty(
                  types.identifier(key),
                  types.identifier(key),
                  false,
                  true,
                ),
              ),
            ),
            types.memberExpression(
              types.identifier('window'),
              types.identifier('mc'),
            ),
          ),
        ]),
      );
    },
    ImportDeclaration(path) {
      path.remove();
    },
    ExportDefaultDeclaration(path) {
      path.replaceWith(path.node.declaration);
    },
  },
}));

export interface TransformError {
  message: string;
  loc: {line: number; column: number; index: number};
}

export function transform(code: string): TransformError | null {
  try {
    const result = Babel.transform(code, {
      filename: 'fiddle.tsx',
      presets: [
        'typescript',
        [
          'react',
          {
            runtime: 'automatic',
            importSource: '@motion-canvas/2d/lib',
          },
        ],
      ],
      plugins: ['mc'],
    });
    eval(result.code);
  } catch (e) {
    return e as TransformError;
  }

  return null;
}
