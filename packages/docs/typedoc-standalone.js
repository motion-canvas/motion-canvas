const factory = require('./typedoc.js');

(async () => {
  process.env.NODE_ENV = 'production';
  const plugin = factory();
  await plugin.loadContent();
})();
