#!/usr/bin/env node

import 'konva';
import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import os from 'os';
import {fileURLToPath} from 'url';
import canvas from 'canvas';
const {createCanvas, Image} = canvas;

const tmpDir = path.resolve(os.tmpdir(), 'motion-canvas');
const projectFile = path.resolve(process.cwd(), process.argv[2]);
const output = path.resolve(process.cwd(), process.argv[3] ?? 'output');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isLinked = !__dirname.includes('node_modules');

fs.mkdirSync(output, {recursive: true});

function build(entry) {
  return new Promise((resolve, reject) => {
    webpack(
      {
        entry,
        devtool: false,
        mode: 'development',
        target: 'node',
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              exclude: /node_modules([\\]+|\/)+(?!@aarthificial)/,
              options: {
                allowTsInNodeModules: true,
              },
            },
          ],
        },
        resolve: {
          extensions: ['.js', '.ts', '.tsx'],
          alias: {
            MC: path.resolve(__dirname, isLinked ? '../src' : '../dist'),
          },
        },
        output: {
          filename: `result.js`,
          path: output,
          library: {
            type: 'commonjs-module',
          },
        },
      },
      (error, stats) => {
        if (error || stats.hasErrors()) {
          reject(error || stats);
        }
        resolve();
      },
    );
  });
}

(async () => {
  await build(projectFile);
  const setup = await import(
    /* webpackIgnore: true */
    `file://${path.join(output, 'result.js')}`
  );

  let totalSize = 0;
  const startTime = Date.now();
  const project = setup.default.default(createCanvas, Image);
  project.start();
  while (!project.next()) {
    const name = String(project.frame).padStart(6, '0');
    const content = project.toDataURL().replace(/^data:image\/png;base64,/, '');
    const size = (content.length * 2) / 1024;
    totalSize += size;

    fs.writeFileSync(path.resolve(output, `frame-${name}.png`), content, {
      encoding: 'base64',
    });
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `Frame: ${name}, Size: ${Math.round(size)} kB, Total: ${Math.round(
        totalSize,
      )} kB, Elapsed: ${Math.round((Date.now() - startTime) / 1000)}`,
    );
  }
})().catch(console.error);
