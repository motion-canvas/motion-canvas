const {SourceMapGenerator} = require('source-map');
const path = require('path');

/**
 * Webpack Loader for meta files.
 *
 * @param {string} source
 */
function metaLoader(source) {
  const relative = path.relative(this.rootContext, this.resourcePath);
  const name = path.basename(relative, '.meta');
  const generator = new SourceMapGenerator({file: this.resourcePath});
  const lines = source.split('\n');
  for (let i = 0; i < lines.length; i++) {
    generator.addMapping({
      source: this.resourcePath,
      generated: {
        line: i + 5,
        column: 3,
      },
      original: {
        line: i + 1,
        column: 1,
      },
    });
  }
  generator.setSourceContent(this.resourcePath, source);
  const map = generator.toJSON();
  const content = `import {Meta} from '@motion-canvas/core/lib';
Meta.register(
  '${name}', 
  '${encodeURI(relative)}', 
  ${source}
);
module.hot.accept(console.error);`;
  this.callback(null, content, map);
}

module.exports = metaLoader;
