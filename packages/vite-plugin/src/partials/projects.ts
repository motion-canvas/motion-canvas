import path from 'path';
import {Plugin, ResolvedConfig} from 'vite';
import {PluginOptions, ProjectData} from '../plugins';
import {createMeta} from '../utils';
import {getVersions} from '../versions';

const PROJECT_QUERY_REGEX = /[?&]project\b/;

interface ProjectPluginConfig {
  buildForEditor?: boolean;
  plugins: PluginOptions[];
  projects: ProjectData[];
}

export function projectsPlugin({
  buildForEditor,
  plugins,
  projects,
}: ProjectPluginConfig): Plugin {
  const versions = JSON.stringify(getVersions());
  let config: ResolvedConfig;
  return {
    name: 'motion-canvas:project',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async load(id) {
      if (!PROJECT_QUERY_REGEX.test(id)) {
        return;
      }

      const [base] = id.split('?');
      const {name, dir} = path.posix.parse(base);

      const runsInEditor = buildForEditor || config.command === 'serve';
      const metaFile = `${name}.meta`;
      await createMeta(path.join(dir, metaFile));

      const imports: string[] = [];
      const pluginNames: string[] = [];
      let index = 0;
      for (const plugin of plugins) {
        if (plugin.entryPoint) {
          const pluginName = `plugin${index}`;
          let options = (await plugin.runtimeConfig?.()) ?? '';
          if (typeof options !== 'string') {
            options = JSON.stringify(options);
          }

          imports.push(`import ${pluginName} from '${plugin.entryPoint}'`);
          pluginNames.push(`${pluginName}(${options})`);
          index++;
        }
      }

      /* language=typescript */
      return `\
${imports.join('\n')}
import {${
        runsInEditor ? 'editorBootstrap' : 'bootstrap'
      }} from '@motion-canvas/core';
import {MetaFile} from '@motion-canvas/core';
        import metaFile from './${metaFile}';
        import config from './${name}';
        import settings from 'virtual:settings.meta';
        export default ${runsInEditor ? 'await editorBootstrap' : 'bootstrap'}(
          '${name}',
          ${versions},
          [${pluginNames.join(', ')}],
          config,
          metaFile,
          settings,
        );`;
    },

    config(config) {
      return {
        build: {
          target: buildForEditor ? 'esnext' : 'modules',
          assetsDir: './',
          rollupOptions: {
            preserveEntrySignatures: 'strict',
            input: Object.fromEntries(
              projects.map(project => [project.name, project.url + '?project']),
            ),
          },
        },
        server: {
          port: config?.server?.port ?? 9000,
        },
        esbuild: {
          jsx: 'automatic',
          jsxImportSource: '@motion-canvas/2d/lib',
        },
        optimizeDeps: {
          entries: projects.map(project => project.url),
          exclude: ['preact', 'preact/*', '@preact/signals'],
        },
      };
    },
  };
}
