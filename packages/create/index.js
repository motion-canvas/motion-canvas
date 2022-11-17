#!/usr/bin/env node
//@ts-check
import prompts from 'prompts';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'node:url';
import kleur from 'kleur';

const FILES_TO_MODIFY = {
  gitignore: '.gitignore',
  '.gitkeep': false,
};

const MANIFEST = JSON.parse(
  fs.readFileSync(
    path.resolve(fileURLToPath(import.meta.url), '../package.json'),
    'utf-8',
  ),
);

(async () => {
  const response = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Project name',
      initial: 'my-animation',
      validate: value =>
        isValidPackageName(value)
          ? true
          : 'Project name must be a valid npm package name.',
    },
    {
      type: 'text',
      name: 'path',
      message: 'Project path',

      initial: value => {
        return path.normalize(value.replace('@', ''));
      },

      validate: value => {
        let dir = path.normalize(value.trim());
        if (!fs.existsSync(dir)) {
          return true;
        }
        if (!fs.lstatSync(dir).isDirectory()) {
          return `Project path "${dir}" must be a valid directory.`;
        }
        if (fs.readdirSync(dir).length > 0) {
          return dir === '.'
            ? 'Current directory must be empty.'
            : `Target directory "${dir}" must be empty.`;
        }
        return true;
      },
      format: value => path.resolve(value),
    },
    {
      type: 'select',
      name: 'language',
      message: 'Language',
      choices: [
        {
          title: 'TypeScript (Recommended)',
          value: 'ts',
        },
        {
          title: 'JavaScript',
          value: 'js',
        },
      ],
    },
  ]);

  if (!response.language) {
    console.log(kleur.red('× Scaffolding aborted by the user.\n'));
    return;
  }

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '..',
    `template-2d-${response.language}`,
  );
  copyDirectory(templateDir, response.path);

  const manifest = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
  );
  manifest.name = response.name;
  if (manifest.dependencies) {
    cloneVersions(manifest.dependencies);
  }
  if (manifest.devDependencies) {
    cloneVersions(manifest.devDependencies);
  }
  fs.writeFileSync(
    path.join(response.path, 'package.json'),
    JSON.stringify(manifest, undefined, 2),
  );

  const manager = getPackageManager();
  console.log(kleur.green('\n√ Scaffolding complete. You can now run:'));
  if (response.path !== process.cwd()) {
    console.log(
      `  ${kleur.bold('cd')} ${path.relative(process.cwd(), response.path)}`,
    );
  }
  const boldManager = kleur.bold(manager);
  if (manager === 'yarn') {
    console.log(`  ${boldManager}`);
    console.log(`  ${boldManager} serve`);
  } else {
    console.log(`  ${boldManager} install`);
    console.log(`  ${boldManager} run serve`);
  }
  console.log();
})();

function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName,
  );
}

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, {recursive: true});
  for (const file of fs.readdirSync(src)) {
    let target = file;
    if (file in FILES_TO_MODIFY) {
      if (FILES_TO_MODIFY[file] === false) continue;
      target = FILES_TO_MODIFY[file];
    }
    const srcFile = path.resolve(src, file);
    const destFile = path.resolve(dest, target);
    copy(srcFile, destFile);
  }
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDirectory(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function getPackageManager() {
  const ua = process.env.npm_config_user_agent;
  return ua?.split(' ')[0].split('/')[0] ?? 'npm';
}

function cloneVersions(versions) {
  for (const dependency in versions) {
    if (
      dependency.startsWith('@motion-canvas') &&
      MANIFEST.devDependencies[dependency]
    ) {
      versions[dependency] = MANIFEST.devDependencies[dependency];
    }
  }
}
