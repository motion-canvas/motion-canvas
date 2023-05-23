/* eslint-disable @typescript-eslint/naming-convention */
import * as Babel from '@babel/standalone';
import type {View2D} from '@motion-canvas/2d';
import type {
  FullSceneDescription,
  ThreadGeneratorFactory,
} from '@motion-canvas/core';

export class TransformError extends Error {
  public constructor(
    message: string,
    public errors: {from: number; to: number; tooltip?: string}[],
  ) {
    super(message);
  }
}

export function transform(code: string, name: string): string {
  const filename = `${name}.tsx`;
  const undeclaredVariables = new Set();
  const errors: {from: number; to: number; tooltip: string}[] = [];
  let result: {code: string};
  let errorMessage: string = null;
  try {
    result = Babel.transform(code, {
      filename,
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
                errors.push({
                  from: node.start,
                  to: node.end,
                  tooltip: `Cannot find name '${node.name}'.`,
                });
              }
            },
          },
        }),
      ],
    });
  } catch (error) {
    const match = /(.*) \(\d+:\d+\)/.exec(
      error.message.slice(filename.length + 1),
    );
    errorMessage = match ? match[1] : error.message;
    if (error.loc) {
      errors.push({
        from: error.pos as number,
        to: error.pos as number,
        tooltip: errorMessage,
      });
    }
  }

  if (errors.length > 0) {
    throw new TransformError(
      errorMessage ??
        `Cannot find names: ${Array.from(undeclaredVariables).join(
          ', ',
        )}\nDid you forget to import them?`,
      errors,
    );
  }

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
