const {Marked} = require('marked');
const highlightJs = require('highlight.js');

module.exports = new Marked({
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
