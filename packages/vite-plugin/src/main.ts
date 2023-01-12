import type {Plugin, ResolvedConfig} from 'vite';
import path from 'path';
import fs from 'fs';
import {Readable} from 'stream';
import mime from 'mime-types';

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
   * @default './src/project.ts'
   */
  project?: string | string[];
  /**
   * A directory path to which the animation will be rendered.
   *
   * @default './output'
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
   * @default /\.(wav|mp3|ogg)$/
   */
  bufferedAssets?: RegExp;
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
   * @default '\@motion-canvas/ui'
   */
  editor?: string;
}

interface ProjectData {
  name: string;
  url: string;
}

export default ({
  project = './src/project.ts',
  output = './output',
  bufferedAssets = /\.(wav|mp3|ogg)$/,
  editor = '@motion-canvas/ui',
}: MotionCanvasPluginConfig = {}): Plugin => {
  const editorPath = path.dirname(require.resolve(editor));
  const editorFile = fs.readFileSync(path.resolve(editorPath, 'editor.html'));
  const htmlParts = editorFile
    .toString()
    .replace('{{style}}', `/@fs/${path.resolve(editorPath, 'style.css')}`)
    .split('{{source}}');
  const createHtml = (src: string) => htmlParts[0] + src + htmlParts[1];

  const resolvedEditorId = '\0virtual:editor';
  const timeStamps: Record<string, number> = {};
  const outputPath = path.resolve(output);
  const projects: ProjectData[] = [];
  const projectLookup: Record<string, ProjectData> = {};
  for (const url of typeof project === 'string' ? [project] : project) {
    const {name} = path.parse(url);
    const data = {name, url};
    projects.push(data);
    projectLookup[name] = data;
  }

  let viteConfig: ResolvedConfig;

  function source(...lines: string[]) {
    return lines.join('\n');
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

  return {
    name: 'motion-canvas',
    async configResolved(resolvedConfig) {
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
            `import meta from './${metaFile}';`,
            `import description from './${sceneFile}';`,
            `description.name = '${name}';`,
            `description.meta = meta;`,
            `if (import.meta.hot) {`,
            `  description.onReplaced = import.meta.hot.data.onReplaced;`,
            `}`,
            `description.onReplaced ??= new ValueDispatcher(description.config);`,
            `if (import.meta.hot) {`,
            `  import.meta.hot.accept();`,
            `  if (import.meta.hot.data.onReplaced) {`,
            `    description.onReplaced.current = description.config;`,
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

          return source(
            `import {Project} from '@motion-canvas/core';`,
            `import meta from './${metaFile}';`,
            `import config from './${name}';`,
            `const factory = () => {`,
            `  if (config instanceof Project) {`,
            `    config.meta = meta;`,
            `    config.name = '${name}';`,
            `    config.logger.warn({`,
            `      message: 'A project instance was exported instead of a project factory.',`,
            `      remarks: \`<p>Use the "makeProject()" function instead:</p><pre>import {makeProject} from '@motion-canvas/core';\nexport default makeProject({\n  // Configuration and scenes go here.\n});</pre>\`,`,
            `      stack: config.creationStack,`,
            `    });`,
            `    return config;`,
            `  }`,
            `  return new Project('${name}', meta, config);`,
            `}`,
            `export default factory;`,
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
          `import {Meta} from '@motion-canvas/core/lib';`,
          `let meta;`,
          `if (import.meta.hot) {`,
          `  meta = import.meta.hot.data.meta;`,
          `}`,
          `meta ??= new Meta('${name}', ${sourceFile}, ${code});`,
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
        if (req.url && bufferedAssets.test(req.url)) {
          const file = fs.readFileSync(
            path.resolve(viteConfig.root, req.url.slice(1)),
          );
          Readable.from(file).pipe(res);
          return;
        }

        if (req.url === '/') {
          res.end(createHtml('/@id/__x00__virtual:editor'));
          return;
        }

        const name = req.url?.slice(1);
        if (name && name in projectLookup) {
          res.end(createHtml(`/@id/__x00__virtual:editor?project=${name}`));
          return;
        }

        next();
      });
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
        async ({frame, mimeType, data, project, isStill}, client) => {
          const extension = mime.extension(mimeType);
          const name = frame.toString().padStart(6, '0') + '.' + extension;
          const file = isStill
            ? path.join(outputPath, 'still', project, name)
            : path.join(outputPath, project, name);

          const directory = path.dirname(file);
          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, {recursive: true});
          }

          const base64Data = data.slice(data.indexOf(',') + 1);
          await fs.promises.writeFile(file, base64Data, {
            encoding: 'base64',
          });
          client.send('motion-canvas:export-ack', {frame});
        },
      );
    },
    config() {
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
          port: 9000,
        },
        esbuild: {
          jsx: 'automatic',
          jsxImportSource: '@motion-canvas/2d/lib',
        },
      };
    },
  };
};
