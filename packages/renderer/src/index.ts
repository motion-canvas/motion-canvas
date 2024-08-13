#!/usr/bin/env node

import type {RendererSettings} from '@motion-canvas/core';
import {program} from 'commander';
import * as path from 'path';
import * as process from 'process';
import {
  parseJSONFile,
  parseJSONString,
  parseRecord,
  parseTuple,
} from './parsing.js';
import {render} from './puppeteer.js';

program
  .name('motion-canvas-render')
  .description(
    'CLI tool for rendering Motion Canvas projects in headless mode.',
  );

program
  .argument('<path>', 'path to the project')
  .option('-p, --project <name>', 'name of the project to render')
  .option('-o, --output <path>', 'path to the output directory')
  .option('--product <name>', 'browser to use', 'firefox')
  .option('--debug', 'enable debug mode')
  .option('--background <color>', 'background color')
  .option('--range <from>:<to>', 'time range in seconds', parseTuple)
  .option(
    '--size <width>:<height>',
    'size of the project in pixels',
    parseTuple,
  )
  .option('--fps <number>', 'frames per second', parseInt)
  .option('--scale <number>', 'resolution scale', parseFloat)
  .option('--exporter <name>', 'name of the exporter')
  .option(
    '--exportOptions <key=value...>',
    'key-value pairs of export options',
    parseRecord,
  )
  .option(
    '--variables <key=value...>',
    'key-value paris of project variables',
    parseRecord,
  )
  .option(
    '--variablesJSON <json>',
    'JSON string with project variables',
    parseJSONString,
  )
  .option(
    '--variablesFile <json>',
    'Path to a JSON file with project variables',
    parseJSONFile,
  )
  .action((projectPath, options) => {
    const settings: Partial<RendererSettings> = {};
    if (options.background) {
      settings.background = options.background;
    }
    if (options.range) {
      settings.range = options.range;
    }
    if (options.size) {
      settings.size = options.size;
    }
    if (options.fps) {
      settings.fps = options.fps;
    }
    if (options.scale) {
      settings.resolutionScale = options.scale;
    }

    settings.exporter = {
      name: options.exporter ?? '',
      options: options.exportOptions ?? {},
    };

    let variables: Record<string, string> = {};
    if (options.variables) {
      variables = options.variables;
    }
    if (options.variablesJSON) {
      variables = {
        ...variables,
        ...options.variablesJSON,
      };
    }
    if (options.variablesFile) {
      variables = {
        ...variables,
        ...options.variablesFile,
      };
    }
    settings.variables = variables;

    const output = options.output
      ? path.resolve(process.cwd(), options.output)
      : undefined;
    process.chdir(path.resolve(process.cwd(), projectPath));
    return render(
      {
        output,
        project: options.project,
        product: options.product,
        debug: options.debug,
      },
      settings,
    );
  });

program.parse();
