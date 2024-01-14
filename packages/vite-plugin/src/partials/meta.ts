import fs from 'fs';
import path from 'path';
import {Plugin, ResolvedConfig} from 'vite';

export function metaPlugin(): Plugin {
  const timeStamps: Record<string, number> = {};
  let config: ResolvedConfig;
  return {
    name: 'motion-canvas:meta',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async transform(code, id) {
      const [base] = id.split('?');
      const {name, ext} = path.posix.parse(base);
      if (ext !== '.meta') {
        return;
      }

      const sourceFile =
        config.command === 'build' ? false : JSON.stringify(id);

      /* language=typescript */
      return `\
import {MetaFile} from '@motion-canvas/core';
let meta;
if (import.meta.hot) {
  meta = import.meta.hot.data.meta;
}
meta ??= new MetaFile('${name}', ${sourceFile});
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.data.meta = meta;
}
meta.loadData(${code});
export default meta;
`;
    },

    configureServer(server) {
      server.ws.on('motion-canvas:meta', async ({source, data}, client) => {
        // Ignore virtual meta files.
        if (source.startsWith('\0')) {
          return;
        }

        timeStamps[source] = Date.now();
        await fs.promises.writeFile(
          source,
          JSON.stringify(data, undefined, 2),
          'utf8',
        );
        client.send('motion-canvas:meta-ack', {source});
      });
    },

    handleHotUpdate(ctx) {
      const now = Date.now();
      const modules = [];

      for (const module of ctx.modules) {
        if (
          module.file !== null &&
          timeStamps[module.file] &&
          timeStamps[module.file] + 1000 > now
        ) {
          continue;
        }

        modules.push(module);
      }

      return modules;
    },
  };
}
