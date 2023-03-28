import type {Plugin, ResolvedConfig} from 'vite';
import path from 'path';
import fs from 'fs';
import {Readable} from 'stream';
import mime from 'mime-types';
import {
  motionCanvasCorsProxy,
  MotionCanvasCorsProxyOptions,
  setupEnvVarsForProxy,
} from './proxy-middleware';
import {getVersions} from './versions';
import {PluginOptions, isPlugin, PLUGIN_OPTIONS} from './plugins';

export interface MotionCanvasPluginConfig {
  /**
   * The import path of the project file or an array of paths.
   *
   * @remarks
   * Each file must contain a default export exposing an instance of the
   * {@link Project} class.
   *
   * @example
   * ```ts
   * motionCanvas({
   *   project: [
   *     './src/firstProject.ts',
   *     './src/secondProject.ts',
   *   ]
   * })
   * ```
   *
   * @defaultValue './src/project.ts'
   */
  project?: string | string[];
  /**
   * A directory path to which the animation will be rendered.
   *
   * @defaultValue './output'
   */
  output?: string;
  /**
   * Defines which assets should be buffered before being sent to the browser.
   *
   * @remarks
   * Streaming larger assets directly from the drive my cause issues with other
   * applications. For instance, if an audio file is being used in the project,
   * Adobe Audition will perceive it as "being used by another application"
   * and refuse to override it.
   *
   * Buffered assets are first loaded to the memory and then streamed from
   * there. This leaves the original files open for modification with hot module
   * replacement still working.
   *
   * @defaultValue /\.(wav|ogg)$/
   */
  bufferedAssets?: RegExp | false;
  /**
   * The import path of the editor package.
   *
   * @remarks
   * This path will be resolved using Node.js module resolution rules.
   * It should lead to a directory containing the following files:
   * - `editor.html` - The HTML template for the editor.
   * - `styles.css` - The editor styles.
   * - `main.js` - A module exporting necessary factory functions.
   *
   * `main.js` should export the following functions:
   * - `editor` - Receives the project factory as its first argument and creates
   *              the user interface.
   * - `index` - Receives a list of all projects as its first argument and
   *             creates the initial page for selecting a project.
   *
   * @defaultValue '\@motion-canvas/ui'
   */
  editor?: string;
  /**
   * Configuration of the Proxy used for remote sources
   *
   * @remarks
   * This passes configuration to Motion Canvas' proxy.
   * Note that the proxy is disabled by default.
   * You can either pass `true` and a config object
   * to enable it.
   **/
  proxy?: boolean | MotionCanvasCorsProxyOptions;
}

interface ProjectData {
  name: string;
  url: string;
}

export default ({
  project = './src/project.ts',
  output = './output',
  bufferedAssets = /\.(wav|ogg)$/,
  editor = '@motion-canvas/ui',
  proxy,
}: MotionCanvasPluginConfig = {}): Plugin => {
  const plugins: PluginOptions[] = [
    {entryPoint: '@motion-canvas/core/lib/plugin/DefaultPlugin'},
  ];
  const editorPath = path.dirname(require.resolve(editor));
  const editorFile = fs.readFileSync(path.resolve(editorPath, 'editor.html'));
  const htmlParts = editorFile
    .toString()
    .replace('{{style}}', `/@fs/${path.resolve(editorPath, 'style.css')}`)
    .split('{{source}}');
  const createHtml = (src: string) => htmlParts[0] + src + htmlParts[1];
  const versions = JSON.stringify(getVersions());

  const resolvedEditorId = '\0virtual:editor';

  const timeStamps: Record<string, number> = {};
  const outputPath = path.resolve(output);
  const projects: ProjectData[] = [];
  const projectLookup: Record<string, ProjectData> = {};
  for (const url of typeof project === 'string' ? [project] : project) {
    const {name, dir} = path.posix.parse(url);
    const metaFile = `${name}.meta`;
    const metaData = getMeta(path.join(dir, metaFile));
    const data = {name: metaData?.name ?? name, fileName: name, url};
    projects.push(data);
    projectLookup[name] = data;
  }

  let viteConfig: ResolvedConfig;

  function source(...lines: string[]) {
    return lines.join('\n');
  }

  function getMeta(metaPath: string) {
    if (fs.existsSync(metaPath)) {
      return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    }
  }

  async function createMeta(metaPath: string) {
    if (!fs.existsSync(metaPath)) {
      await fs.promises.writeFile(
        metaPath,
        JSON.stringify({version: 0}, undefined, 2),
        'utf8',
      );
    }
  }

  // Initialize the Proxy Module
  setupEnvVarsForProxy(proxy);

  return {
    name: 'motion-canvas',
    async configResolved(resolvedConfig) {
      plugins.push(
        ...resolvedConfig.plugins
          .filter(isPlugin)
          .map(plugin => plugin[PLUGIN_OPTIONS]),
      );
      viteConfig = resolvedConfig;
    },
    async load(id) {
      const [base, query] = id.split('?');
      const {name, dir} = path.posix.parse(base);

      if (id.startsWith(resolvedEditorId)) {
        if (projects.length === 1) {
          return source(
            `import {editor} from '${editor}';`,
            `import project from '${projects[0].url}?project';`,
            `editor(project);`,
          );
        }

        if (query) {
          const params = new URLSearchParams(query);
          const name = params.get('project');
          if (name && name in projectLookup) {
            return source(
              `import {editor} from '${editor}';`,
              `import project from '${projectLookup[name].url}?project';`,
              `editor(project);`,
            );
          }
        }

        return source(
          `import {index} from '${editor}';`,
          `index(${JSON.stringify(projects)});`,
        );
      }

      if (query) {
        const params = new URLSearchParams(query);
        if (params.has('scene')) {
          const metaFile = `${name}.meta`;
          await createMeta(path.join(dir, metaFile));
          const sceneFile = `${name}`;

          return source(
            `import {ValueDispatcher} from '@motion-canvas/core/lib/events';`,
            `import metaFile from './${metaFile}';`,
            `import description from './${sceneFile}';`,
            `description.name = '${name}';`,
            `metaFile.attach(description.meta);`,
            `if (import.meta.hot) {`,
            `  description.onReplaced = import.meta.hot.data.onReplaced;`,
            `}`,
            `description.onReplaced ??= new ValueDispatcher(description.config);`,
            `if (import.meta.hot) {`,
            `  import.meta.hot.accept();`,
            `  if (import.meta.hot.data.onReplaced) {`,
            `    description.onReplaced.current = description;`,
            `  } else {`,
            `    import.meta.hot.data.onReplaced = description.onReplaced;`,
            `  }`,
            `}`,
            `export default description;`,
          );
        }

        if (params.has('project')) {
          const metaFile = `${name}.meta`;
          await createMeta(path.join(dir, metaFile));

          const imports: string[] = [];
          const pluginNames: string[] = ['...config.plugins'];
          let index = 0;
          for (const plugin of plugins) {
            if (plugin.entryPoint) {
              const pluginName = `plugin${index}`;
              imports.push(`import ${pluginName} from '${plugin.entryPoint}'`);
              pluginNames.push(pluginName);
              index++;
            }
          }

          return source(
            ...imports,
            `import {ProjectMetadata} from '@motion-canvas/core/lib/app';`,
            `import metaFile from './${metaFile}';`,
            `import config from './${name}';`,
            `const project = {`,
            `  name: '${name}',`,
            `  versions: ${versions},`,
            `  ...config,`,
            `  plugins: [${pluginNames.join(', ')}],`,
            `};`,
            `project.meta = new ProjectMetadata(project);`,
            `metaFile.attach(project.meta)`,
            `export default project;`,
          );
        }
      }
    },
    async transform(code, id) {
      const [base, query] = id.split('?');
      const {name, dir, ext} = path.posix.parse(base);

      if (query) {
        const params = new URLSearchParams(query);
        if (params.has('img')) {
          return source(
            `import {loadImage} from '@motion-canvas/core/lib/media';`,
            `import image from '/@fs/${base}';`,
            `export default loadImage(image);`,
          );
        }

        if (params.has('anim')) {
          const nameRegex = /\D*(\d+)\./;
          let urls: string[] = [];
          for (const file of await fs.promises.readdir(dir)) {
            const match = nameRegex.exec(file);
            if (!match) continue;
            const index = parseInt(match[1]);
            urls[index] = path.posix.join(dir, file);
          }
          urls = urls.filter(Boolean);

          return source(
            `import {loadAnimation} from '@motion-canvas/core/lib/media';`,
            ...urls.map(
              (url, index) => `import image${index} from '/@fs/${url}';`,
            ),
            `export default loadAnimation([${urls
              .map((_, index) => `image${index}`)
              .join(', ')}]);`,
          );
        }
      }

      if (ext === '.meta') {
        const sourceFile = viteConfig.command === 'build' ? false : `'${id}'`;
        return source(
          `import {MetaFile} from '@motion-canvas/core/lib/meta';`,
          `let meta;`,
          `if (import.meta.hot) {`,
          `  meta = import.meta.hot.data.meta;`,
          `}`,
          `meta ??= new MetaFile('${name}', ${sourceFile});`,
          `if (import.meta.hot) {`,
          `  import.meta.hot.accept();`,
          `  import.meta.hot.data.meta = meta;`,
          `}`,
          `meta.loadData(${code});`,
          `export default meta;`,
        );
      }
    },
    handleHotUpdate(ctx) {
      const now = Date.now();
      const urls = [];
      const modules = [];

      for (const module of ctx.modules) {
        if (
          module.file !== null &&
          timeStamps[module.file] &&
          timeStamps[module.file] + 1000 > now
        ) {
          continue;
        }

        urls.push(module.url);
        modules.push(module);
      }

      if (urls.length > 0) {
        ctx.server.ws.send('motion-canvas:assets', {urls});
      }

      return modules;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && bufferedAssets && bufferedAssets.test(req.url)) {
          const file = fs.readFileSync(
            path.resolve(viteConfig.root, req.url.slice(1)),
          );
          Readable.from(file).pipe(res);
          return;
        }

        const url = req.url
          ? new URL(req.url, `http://${req.headers.host}`)
          : undefined;
        if (url?.pathname === '/') {
          res.setHeader('Content-Type', 'text/html');
          res.end(createHtml('/@id/__x00__virtual:editor'));
          return;
        }

        const name = url?.pathname?.slice(1);
        if (name && name in projectLookup) {
          res.setHeader('Content-Type', 'text/html');
          res.end(createHtml(`/@id/__x00__virtual:editor?project=${name}`));
          return;
        }

        next();
      });

      // if proxy is unset (undefined), or set to false,
      // it will not register its middleware — as a result, no
      // proxy is started.
      if (proxy !== false && proxy !== undefined) {
        motionCanvasCorsProxy(server.middlewares, proxy === true ? {} : proxy);
      }

      server.ws.on('motion-canvas:meta', async ({source, data}, client) => {
        timeStamps[source] = Date.now();
        await fs.promises.writeFile(
          source,
          JSON.stringify(data, undefined, 2),
          'utf8',
        );
        client.send('motion-canvas:meta-ack', {source});
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
    config(config) {
      return {
        build: {
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
      };
    },
  };
};
