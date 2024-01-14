import fs from 'fs';
import path from 'path';
import {Readable} from 'stream';
import {ModuleNode, Plugin, ResolvedConfig} from 'vite';

const AUDIO_EXTENSION_REGEX = /\.(mp3|wav|ogg|aac|flac)(?:$|\?)/;
const AUDIO_HMR_DELAY = 1000;

interface AssetsPluginConfig {
  bufferedAssets: RegExp | false;
}

export function assetsPlugin({bufferedAssets}: AssetsPluginConfig): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'motion-canvas:assets',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && bufferedAssets && bufferedAssets.test(req.url)) {
          const file = fs.readFileSync(
            path.resolve(config.root, req.url.slice(1)),
          );
          Readable.from(file).pipe(res);
          return;
        }

        next();
      });
    },

    async handleHotUpdate(ctx) {
      const urls = [];
      const modules: ModuleNode[] = [];

      for (const module of ctx.modules) {
        urls.push(module.url);
        if (!AUDIO_EXTENSION_REGEX.test(module.url)) {
          modules.push(module);
        } else {
          await new Promise(resolve => {
            setTimeout(resolve, AUDIO_HMR_DELAY);
          });
        }
      }

      if (urls.length > 0) {
        ctx.server.ws.send('motion-canvas:assets', {urls});
      }

      return modules;
    },
  };
}
