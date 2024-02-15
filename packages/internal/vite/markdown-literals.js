const marked = require('../common/marked');

module.exports = () => ({
  name: 'markdown-literals',
  async transform(code, id) {
    if (id.endsWith('.md')) {
      return `export default ${JSON.stringify(marked.parse(code))};`;
    }
  },
});
