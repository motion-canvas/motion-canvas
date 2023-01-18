module.exports = () => ({
  name: 'markdown-literals',
  async load(id) {
    if (id.endsWith('.md')) {
      return `export default 'Mockup text';`;
    }
  },
});
