#!/usr/bin/env node

import prompts from 'prompts';
import fs from 'fs';
import path from 'path';
import kleur from 'kleur';

import {add} from './add/index';
import {setProjectInfo, Language} from './projectInfo';

function isMotionCanvasProject(): boolean {
  if (!fs.existsSync(path.resolve('package.json')))
    throw new Error('Unable to locate package.json');
  const dependencies = JSON.stringify(
    JSON.parse(fs.readFileSync(path.resolve('package.json')).toString())
      .dependencies,
  );
  if (dependencies == undefined)
    throw new Error('Unable to locate dependencies in package.json');
  return dependencies.includes('@motion-canvas/core');
}

function findConfigFile(): string {
  const possibleConfigFileNames = ['vite.config.ts', 'vite.config.js'];
  const files = fs.readdirSync('./');
  const match = possibleConfigFileNames.find(name => files.includes(name));
  if (match == undefined)
    throw new Error('Unable to find the config file name.');
  return match;
}

(async () => {
  try {
    isMotionCanvasProject();
    const configFile = findConfigFile();
    let language: Language;
    switch (configFile.slice(-2)) {
      case 'js':
        language = 'js';
        break;
      case 'ts':
        language = 'ts';
        break;
      default:
        throw new Error('Unsupported language');
    }
    setProjectInfo({
      configFile: configFile,
      language: language,
    });
  } catch (e) {
    console.error(kleur.red(`Checks failed\n${e}`));
    return;
  }
  const response = await prompts({
    type: 'select',
    name: 'action',
    message: 'Action',
    choices: [
      {
        title: 'add',
        value: 'add',
      },
    ],
  });

  switch (response.action) {
    case 'add': {
      await add();
      break;
    }
  }
})();
