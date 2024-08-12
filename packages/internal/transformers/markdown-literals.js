const ts = require('typescript');
const path = require('path');
const fs = require('fs');
const marked = require('../common/marked');

const transformerProgram = program => context => sourceFile => {
  const sourceMap = new Map();
  const visitor = node => {
    if (
      (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
        ts.isStringLiteral(node)) &&
      node.getFullText().trim().startsWith('// language=markdown')
    ) {
      return ts.factory.createStringLiteral(marked.parse(node.text));
    }

    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.importClause?.name !== undefined
    ) {
      /**
       * @type {ts.TypeChecker}
       */
      const typeChecker = program.getTypeChecker();
      const moduleSymbol = typeChecker.getSymbolAtLocation(
        node.moduleSpecifier,
      );
      if (moduleSymbol?.escapedName !== '"*.md"') {
        return node;
      }

      const baseDir = path.dirname(sourceFile.fileName);
      const content = marked.parse(
        fs.readFileSync(
          path.resolve(baseDir, node.moduleSpecifier.text),
          'utf-8',
        ),
      );

      const variableSymbol = typeChecker.getSymbolAtLocation(
        node.importClause.name,
      );

      sourceMap.set(variableSymbol, content);
      return undefined;
    }

    if (ts.isIdentifier(node)) {
      const typeChecker = program.getTypeChecker();
      const symbol = typeChecker.getSymbolAtLocation(node);
      if (sourceMap.has(symbol)) {
        return ts.factory.createStringLiteral(sourceMap.get(symbol));
      }

      return node;
    }

    return ts.visitEachChild(node, visitor, context);
  };

  return ts.visitNode(sourceFile, visitor);
};

module.exports = transformerProgram;
