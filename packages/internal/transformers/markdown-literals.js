const ts = require('typescript');
const path = require('path');
const fs = require('fs');
const {Marked} = require('marked');
const highlightJs = require('highlight.js');

const marked = new Marked({
  renderer: {
    link(href, title, text) {
      return `<a href='${href}' target='_blank'>${text}</a>`;
    },
    code(code, info) {
      const [lang, ...rest] = (info || '').split(/\s+/);
      code = code
        .split('\n')
        .filter(line => !line.includes('prettier-ignore'))
        .join('\n');
      const language = highlightJs.getLanguage(lang) ? lang : 'plaintext';
      const result = highlightJs.highlight(code, {language});
      return `<pre class="${rest.join(
        ' ',
      )}"><code class="language-${language}">${result.value}</code></pre>`;
    },
  },
});

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
