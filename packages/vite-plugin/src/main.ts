import path from 'path';
import type {Plugin} from 'vite';
import {
  CorsProxyPluginConfig,
  assetsPlugin,
  corsProxyPlugin,
  editorPlugin,
  exporterPlugin,
  metaPlugin,
  projectsPlugin,
  scenesPlugin,
  settingsPlugin,
  webglPlugin,
} from './partials';
import {PLUGIN_OPTIONS, PluginConfig, PluginOptions, isPlugin} from './plugins';
import {getProjects} from './utils';

export interface MotionCanvasPluginConfig {
  /**
   * The import path of the project file or an array of paths.
   * Also supports globs.
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
   * Streaming larger assets directly from the drive may cause issues with other
   * applications. For instance, if an audio file is being used in the project,
   * Adobe Audition will perceive it as "being used by another application"
   * and refuse to override it.
   *
   * Buffered assets are first loaded to the memory and then streamed from
   * there. This leaves the original files open for modification with hot module
   * replacement still working.
   *
   * @defaultValue /^$/
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
  proxy?: boolean | CorsProxyPluginConfig;

  /**
   * Build the project to run in the editor.
   */
  buildForEditor?: boolean;
}

export default ({
  project = './src/project.ts',
  output = './output',
  bufferedAssets = /^$/,
  editor = '@motion-canvas/ui',
  proxy,
  buildForEditor,
}: MotionCanvasPluginConfig = {}): Plugin[] => {
  const plugins: PluginOptions[] = [];
  let config: PluginConfig = {
    output: path.resolve(output),
    projects: getProjects(project),
  };

  return [
    {
      name: 'motion-canvas',
      async configResolved(resolvedConfig) {
        plugins.push(
          ...resolvedConfig.plugins
            .filter(isPlugin)
            .map(plugin => plugin[PLUGIN_OPTIONS]),
        );

        for (const plugin of plugins) {
          const newConfig = await plugin.config?.(config);
          if (newConfig) {
            config = {...config, ...newConfig};
          }
        }
      },
    },
    metaPlugin(),
    settingsPlugin(),
    scenesPlugin(),
    exporterPlugin({outputPath: config.output}),
    editorPlugin({editor, projects: config.projects}),
    projectsPlugin({projects: config.projects, plugins, buildForEditor}),
    assetsPlugin({bufferedAssets}),
    webglPlugin(),
    corsProxyPlugin(proxy),
  ];
};
