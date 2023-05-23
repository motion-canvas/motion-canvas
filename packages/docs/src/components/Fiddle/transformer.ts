/* eslint-disable @typescript-eslint/naming-convention */
import * as Babel from '@babel/standalone';
import type {View2D} from '@motion-canvas/2d';
import type {
  FullSceneDescription,
  ThreadGeneratorFactory,
} from '@motion-canvas/core';

export interface TransformError {
  message: string;
  loc: {line: number; column: number; index: number};
}

export function transform(code: string, name: string): string {
  const undeclaredVariables = new Set();
  let referenceError = null;
  const result = Babel.transform(code, {
    filename: `${name}.tsx`,
    presets: [
      'typescript',
      [
        'react',
        {
          runtime: 'automatic',
          importSource: '@motion-canvas/2d',
        },
      ],
    ],
    plugins: [
      ({types}) => ({
        visitor: {
          ImportDeclaration(path) {
            if (path.node.source.value.startsWith('@motion-canvas/core')) {
              path.node.source.value = '@motion-canvas/core';
            }
            if (path.node.source.value.startsWith('@motion-canvas/2d')) {
              path.node.source.value = '@motion-canvas/2d';
            }
          },
          ReferencedIdentifier(path) {
            const {node, scope} = path;

            if (types.isIdentifier(node) && !scope.hasBinding(node.name)) {
              undeclaredVariables.add(node.name);
              referenceError ??= path.buildCodeFrameError(
                `Undeclared variable: ${node.name}`,
              );
            }
          },
        },
        post() {
          if (undeclaredVariables.size > 0) {
            throw referenceError;
          }
        },
      }),
    ],
  });

  return result.code;
}

export async function compileScene(
  code: string,
  name: string,
): Promise<FullSceneDescription<ThreadGeneratorFactory<View2D>>> {
  const transformedCode = transform(code, name);
  const scene = await import(
    /* webpackIgnore: true */ URL.createObjectURL(
      new Blob([transformedCode], {type: 'text/javascript'}),
    )
  );
  return scene.default;
}
