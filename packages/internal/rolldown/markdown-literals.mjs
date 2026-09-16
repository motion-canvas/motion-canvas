import marked from '../common/marked.js';

const LANGUAGE_MARKDOWN_REGEX =
  /\/\/\s*language=markdown[ \t]*\r?\n[ \t]*(`(?:\\[\s\S]|[^\\`])*`)/g;

function parseTemplateLiteral(raw) {
  return raw
    .slice(1, -1)
    .replace(/\\\$/g, '$')
    .replace(/\\`/g, '`')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');
}

export default function markdownLiterals() {
  return {
    name: 'markdown-literals',
    transform(code, id) {
      if (id.endsWith('.md')) {
        return {
          code: `export default ${JSON.stringify(marked.parse(code))};`,
          map: null,
        };
      }

      if (!code.includes('language=markdown')) {
        return;
      }

      let changed = false;
      const result = code.replace(LANGUAGE_MARKDOWN_REGEX, (match, literal) => {
        changed = true;
        const html = marked.parse(parseTemplateLiteral(literal));
        return match.slice(0, -literal.length) + JSON.stringify(html);
      });

      if (changed) {
        return {code: result, map: null};
      }
    },
  };
}
