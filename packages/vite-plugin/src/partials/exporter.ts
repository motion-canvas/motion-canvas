import fs from 'fs';
import mime from 'mime-types';
import path from 'path';
import {Plugin} from 'vite';
import {openInExplorer} from '../openInExplorer';

interface ExporterPluginConfig {
  outputPath: string;
}

export function exporterPlugin({outputPath}: ExporterPluginConfig): Plugin {
  return {
    name: 'motion-canvas:exporter',

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
        async (
          {data, frame, sceneFrame, subDirectories, mimeType, groupByScene},
          client,
        ) => {
          const name = (groupByScene ? sceneFrame : frame)
            .toString()
            .padStart(6, '0');
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
          await fs.promises.writeFile(outputFilePath, base64Data, {
            encoding: 'base64',
          });
          client.send('motion-canvas:export-ack', {frame});
        },
      );
    },
  };
}
