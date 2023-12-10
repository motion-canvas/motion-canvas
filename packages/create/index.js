#!/usr/bin/env node
//@ts-check
import fs from 'fs';
import kleur from 'kleur';
import minimist from 'minimist';
import {fileURLToPath} from 'node:url';
import path from 'path';
import prompts from 'prompts';

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

const PLUGINS = {
  core: {
    package: '@motion-canvas/vite-plugin',
    variable: 'motionCanvas',
    options: response =>
      response.language === 'js' ? `{project: './src/project.js'}` : '',
  },
  ffmpeg: {
    package: '@motion-canvas/ffmpeg',
    variable: 'ffmpeg',
    version: '^1.1.0',
  },
};

(async () => {
  const options = minimist(process.argv.slice(2));
  if (options.plugins !== undefined) {
    if (typeof options.plugins === 'string') {
      options.plugins = options.plugins.split(',');
    }

    if (!Array.isArray(options.plugins)) {
      options.plugins = [options.plugins];
    }

    const plugins = ['core'];
    for (const plugin of options.plugins) {
      if (plugin === 'core') continue;
      if (!(plugin in PLUGINS)) {
        console.log(kleur.yellow(`! Unknown plugin "${plugin}".\n`));
        continue;
      }
      plugins.push(plugin);
    }

    options.plugins = plugins;
  }

  prompts.override(options);
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
    {
      type: 'multiselect',
      name: 'plugins',
      message: 'How would you like to render your animation?',
      choices: [
        {
          title: 'Image sequence',
          value: 'core',
          disabled: true,
          selected: true,
        },
        {
          title: 'Video (FFmpeg)',
          value: 'ffmpeg',
          selected: true,
        },
      ],
      warn: 'This option is always included.',
      onRender() {
        this.value[0].selected = true;
      },
      validate: value => {
        if (!Array.isArray(value)) {
          return '"plugins" option must be an array.';
        }

        if (!value.includes('core')) {
          return 'Image sequence is required.';
        }

        return true;
      },
    },
  ]);

  if (!response.plugins) {
    console.log(kleur.red('× Scaffolding aborted by the user.\n'));
    return;
  }

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '..',
    `template-2d-${response.language}`,
  );
  copyDirectory(templateDir, response.path);
  createConfig(response);

  const manifest = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
  );
  manifest.name = response.name;
  manifest.dependencies ??= {};
  for (const plugin of response.plugins) {
    const data = PLUGINS[plugin];
    if (data.version) {
      manifest.dependencies[data.package] = data.version;
    }
  }
  cloneVersions(manifest.dependencies);

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
    console.log(`  ${boldManager} start`);
  } else {
    console.log(`  ${boldManager} install`);
    console.log(`  ${boldManager} start`);
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

function createConfig(response) {
  const imports = [];
  const plugins = [];
  for (const plugin of response.plugins) {
    const data = PLUGINS[plugin];
    imports.push(`import ${data.variable} from '${data.package}';\n`);
    plugins.push(`${data.variable}(${data.options?.(response) ?? ''}),`);
  }

  const configFile = path.resolve(
    response.path,
    `vite.config.${response.language}`,
  );

  fs.writeFileSync(
    configFile,
    `import {defineConfig} from 'vite';
${imports.join('')}
export default defineConfig({
  plugins: [
    ${plugins.join('\n    ')}
  ],
});
`,
  );
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
