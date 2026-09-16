import fs from 'fs';
import {transform as lightningTransform} from 'lightningcss';
import * as sass from 'sass';
import {pathToFileURL} from 'url';

const CSS_REGEX = /\.(?:css|sass|scss)$/;
const MODULE_REGEX = /\.module\.(?:css|sass|scss)$/;
const RESOLVED_PREFIX = '\0motion-canvas:css:';

function compile(file, code) {
  const settings = {
    filename: file,
    code: Buffer.from(code),
    minify: false,
  };

  if (MODULE_REGEX.test(file)) {
    settings.cssModules = true;
  }

  const result = lightningTransform(settings);
  const exports = {};
  for (const [local, value] of Object.entries(result.exports ?? {})) {
    exports[local] = value.name;
  }

  return {css: result.code.toString(), exports};
}

async function compileFile(file) {
  let code = await fs.promises.readFile(file, 'utf8');

  if (/\.s[ac]ss$/.test(file)) {
    const result = await sass.compileStringAsync(code, {
      syntax: file.endsWith('.sass') ? 'indented' : 'scss',
      url: pathToFileURL(file),
      style: 'expanded',
    });
    code = result.css;
  }

  return compile(file, code);
}

export default function css() {
  const styles = new Map();

  return {
    name: 'motion-canvas:css',

    async resolveId(source, importer) {
      if (source.startsWith(RESOLVED_PREFIX)) {
        return source;
      }

      if (!CSS_REGEX.test(source.split('?')[0])) {
        return;
      }

      const resolved = await this.resolve(source, importer, {skipSelf: true});
      if (resolved) {
        return RESOLVED_PREFIX + resolved.id;
      }
    },

    async load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) {
        return;
      }

      const file = id.slice(RESOLVED_PREFIX.length).split('?')[0];
      const {css, exports} = await compileFile(file);
      styles.set(id, css);

      if (MODULE_REGEX.test(file)) {
        return {
          code: `export default ${JSON.stringify(exports)};`,
          map: null,
          moduleType: 'js',
          moduleSideEffects: true,
        };
      }

      return {
        code: '/* motion-canvas:css */',
        map: null,
        moduleType: 'js',
        moduleSideEffects: true,
      };
    },

    generateBundle(options, bundle) {
      const entry = Object.values(bundle).find(
        chunk => chunk.type === 'chunk' && chunk.isEntry,
      );

      if (!entry) {
        return;
      }

      const included = [];
      for (const id of Object.keys(entry.modules)) {
        if (styles.has(id) && !included.includes(id)) {
          included.push(id);
        }
      }

      if (included.length === 0) {
        return;
      }

      const fileName = `${entry.name}.css`;
      this.emitFile({
        type: 'asset',
        fileName,
        source: included.map(id => styles.get(id)).join('\n'),
      });
      entry.code = `import './${fileName}';\n${entry.code}`;
    },
  };
}
