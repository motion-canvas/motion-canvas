import fs from 'fs';
import os from 'os';
import path from 'path';
import {Plugin} from 'vite';

export function settingsPlugin(): Plugin {
  const settingsId = 'virtual:settings.meta';
  const resolvedSettingsId = '\0' + settingsId;
  const settingsPath = path.resolve(
    os.homedir(),
    '.motion-canvas/settings.json',
  );
  const outputDirectory = path.dirname(settingsPath);

  return {
    name: 'motion-canvas:settings',

    resolveId(id) {
      if (id === settingsId) {
        return resolvedSettingsId;
      }
    },

    async load(id) {
      if (id === resolvedSettingsId) {
        let parsed = {};
        try {
          parsed = JSON.parse(await fs.promises.readFile(settingsPath, 'utf8'));
        } catch (_) {
          // Ignore an invalid settings file
        }

        return JSON.stringify(parsed);
      }
    },

    configureServer(server) {
      server.ws.on('motion-canvas:meta', async ({source, data}, client) => {
        if (source !== resolvedSettingsId) {
          return;
        }

        await fs.promises.mkdir(outputDirectory, {recursive: true});
        const newData = JSON.stringify(data, undefined, 2);
        let oldData = '';
        try {
          oldData = await fs.promises.readFile(settingsPath, 'utf8');
        } catch (_) {
          // Ignore an invalid settings file
        }

        if (oldData !== newData) {
          await Promise.all([
            fs.promises.writeFile(settingsPath, newData, 'utf8'),
            // Invalidate the module so that the settings are up-to-date next
            // time the browser is refreshed.
            server.moduleGraph.getModuleByUrl(source).then(module => {
              if (module) {
                server.moduleGraph.invalidateModule(module);
              }
            }),
          ]);
        }

        client.send('motion-canvas:meta-ack', {source});
      });
    },
  };
}
