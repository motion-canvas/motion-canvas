import ts from 'typescript';
import path from 'path';
import fs from 'fs';

const SCENE_REGEX = /\.scene\.tsx?$/;

/**
 * Create a transformer that adds meta imports to projects and scenes.
 *
 * Example meta import:
 * ```ts
 * import './name.meta';
 * ```
 *
 * @param {{project: string, version: string}} config
 * @return {(context: TransformationContext) => TransformerFactory}
 */
export function metaImportTransformer(config) {
  return context => {
    const visitor = node => {
      if (
        node.kind === ts.SyntaxKind.SourceFile &&
        (config.project === path.resolve(node.fileName) ||
          SCENE_REGEX.test(node.fileName))
      ) {
        node = createMeta(context, node, config.version);
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return node => ts.visitNode(node, visitor);
  };
}

/**
 * Add a meta import at the top of the given SourceFile.
 *
 * @param {TransformationContext} context
 * @param {SourceFile} node
 * @param {string} version
 *
 * @return {SourceFile}
 */
function createMeta(context, node, version) {
  const {name, dir} = path.parse(node.fileName);
  const metaFile = `${name}.meta`;
  const metaPath = path.join(dir, metaFile);

  if (!fs.existsSync(metaPath)) {
    fs.writeFileSync(metaPath, JSON.stringify({version}, undefined, 2), 'utf8');
  }

  const importStringLiteral = context.factory.createStringLiteral(
    `./${metaFile}`,
    true,
  );
  const importDeclaration = context.factory.createImportDeclaration(
    undefined,
    undefined,
    undefined,
    importStringLiteral,
  );
  return context.factory.updateSourceFile(node, [
    importDeclaration,
    ...node.statements,
  ]);
}
