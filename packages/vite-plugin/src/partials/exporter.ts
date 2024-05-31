import fs from 'fs';
import mime from 'mime-types';
import path from 'path';
import {openInExplorer} from '../openInExplorer';
import {PLUGIN_OPTIONS, Plugin} from '../plugins';

export function exporterPlugin(): Plugin {
  let outputPath: string;
  return {
    name: 'motion-canvas:exporter',
    [PLUGIN_OPTIONS]: {
      async configResolved(value) {
        outputPath = value.output;
      },
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/__open-output-path') {
          if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, {recursive: true});
          }
          openInExplorer(outputPath);
          res.end();
          return;
        }

        next();
      });

      server.ws.on(
        'motion-canvas:export',
        async ({data, frame, name, subDirectories, mimeType}, client) => {
          const extension = mime.extension(mimeType);
          const outputFilePath = path.join(
            outputPath,
            ...subDirectories,
            `${name}.${extension}`,
          );
          const outputDirectory = path.dirname(outputFilePath);

          if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory, {recursive: true});
          }

          const base64Data = data.slice(data.indexOf(',') + 1);
          await writeBase64(outputFilePath, base64Data);
          client.send('motion-canvas:export-ack', {frame});
        },
      );
    },
  };
}

function writeBase64(filePath: string, base64: string) {
  return new Promise((resolve, reject) => {
    fs.createWriteStream(filePath)
      .on('finish', resolve)
      .on('error', reject)
      .end(Buffer.from(base64, 'base64'));
  });
}
