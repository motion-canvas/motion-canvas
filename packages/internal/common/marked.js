const {Marked} = require('marked');
const highlightJs = require('highlight.js');

module.exports = new Marked({
  renderer: {
    link({href, tokens}) {
      return `<a href='${href}' target='_blank'>${this.parser.parseInline(
        tokens,
      )}</a>`;
    },
    code({text, lang}) {
      const [language, ...rest] = (lang || '').split(/\s+/);
      text = text
        .split('\n')
        .filter(line => !line.includes('prettier-ignore'))
        .join('\n');
      const resolved = highlightJs.getLanguage(language)
        ? language
        : 'plaintext';
      const result = highlightJs.highlight(text, {language: resolved});
      return `<pre class="${rest.join(
        ' ',
      )}"><code class="language-${resolved}">${result.value}</code></pre>`;
    },
  },
});
