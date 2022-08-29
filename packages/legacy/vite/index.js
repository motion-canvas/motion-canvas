module.exports = () => ({
  name: 'motion-canvas:legacy',
  transform(code, id) {
    if (id.endsWith('?project')) {
      return (
        `import '@motion-canvas/legacy/lib/patches/Factory';` +
        `import '@motion-canvas/legacy/lib/patches/Node';` +
        `import '@motion-canvas/legacy/lib/patches/Shape';` +
        `import '@motion-canvas/legacy/lib/patches/Container';` +
        code
      );
    }
  },
  config() {
    return {
      esbuild: {
        jsx: 'automatic',
        jsxImportSource: '@motion-canvas/legacy/lib',
      },
    };
  },
});
