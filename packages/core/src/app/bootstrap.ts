import {MetaFile} from '../meta';
import {Plugin} from '../plugin';
import DefaultPlugin from '../plugin/DefaultPlugin';
import {Logger} from './Logger';
import {Project, ProjectSettings, Versions} from './Project';
import {ProjectMetadata} from './ProjectMetadata';
import {createSettingsMetadata} from './SettingsMetadata';

/**
 * Bootstrap a project.
 *
 * @param name - The name of the project.
 * @param versions - Package versions.
 * @param plugins - Loaded plugins.
 * @param config - Project settings.
 * @param metaFile - The project meta file.
 * @param settingsFile - The settings meta file.
 * @param logger - An optional logger instance.
 * @param pluginResolutions - Mapping from the plugin name to the plugin instance.
 *
 * @internal
 */
export function bootstrap(
  name: string,
  versions: Versions,
  plugins: PluginLike[],
  config: ProjectSettings,
  metaFile: MetaFile<any>,
  settingsFile: MetaFile<any>,
  logger = config.logger ?? new Logger(),
  pluginResolutions: Map<string, Plugin> = new Map<string, Plugin>(),
): Project {
  const settings = createSettingsMetadata();
  settingsFile.attach(settings);

  function resolvePlugin(plugin: PluginLike): Plugin | undefined {
    if (typeof plugin !== 'string') return plugin;

    return pluginResolutions.get(plugin);
  }

  function resolvePluginList(plugins: PluginLike[] | undefined): Plugin[] {
    return plugins?.map(resolvePlugin)?.filter(isDefined) ?? [];
  }

  const allPlugins = [
    DefaultPlugin(),
    ...resolvePluginList(consolidatePluginList(config, plugins)),
  ];

  const pluginSet = new Set<string>();
  const includedPlugins: Plugin[] = [];
  let resolvedConfig = config;

  for (const plugin of allPlugins) {
    if (!plugin || pluginSet.has(plugin.name)) {
      continue;
    }

    pluginSet.add(plugin.name);
    includedPlugins.push(plugin);

    resolvedConfig = {
      ...resolvedConfig,
      ...(plugin.settings?.(resolvedConfig) ?? {}),
    };
  }

  const project = {
    name,
    ...config,
    plugins: includedPlugins,
    versions,
    settings,
    logger,
  } as Project;

  project.meta = new ProjectMetadata(project);
  project.meta.shared.set(settings.defaults.get());
  project.experimentalFeatures ??= false;
  metaFile.attach(project.meta);

  includedPlugins.forEach(plugin => plugin.project?.(project));

  return project;
}

/**
 * Bootstrap a project together with all editor plugins.
 *
 * @param name - The name of the project.
 * @param versions - Package versions.
 * @param plugins - Loaded plugins.
 * @param config - Project settings.
 * @param metaFile - The project meta file.
 * @param settingsFile - The settings meta file.
 *
 * @internal
 */
export async function editorBootstrap(
  name: string,
  versions: Versions,
  plugins: PluginLike[],
  config: ProjectSettings,
  metaFile: MetaFile<any>,
  settingsFile: MetaFile<any>,
): Promise<Project> {
  const logger = config.logger ?? new Logger();
  const pluginResolutions = new Map<string, Plugin>();

  const allPlugins = consolidatePluginList(config, plugins);
  await loadPluginList(allPlugins, logger, pluginResolutions);

  return bootstrap(
    name,
    versions,
    plugins,
    config,
    metaFile,
    settingsFile,
    logger,
    pluginResolutions,
  );
}

async function loadPluginList(
  plugins: PluginLike[] | undefined,
  logger: Logger,
  resolutions: Map<string, Plugin>,
) {
  if (!plugins) return;

  await Promise.all(
    plugins.map(async plugin => {
      if (typeof plugin !== 'string') return;

      const loadedPlugin = await loadPlugin(plugin, logger);
      if (!loadedPlugin) return;
      resolutions.set(plugin, loadedPlugin);
    }),
  );
}

async function loadPlugin(
  plugin: string,
  logger: Logger,
): Promise<Plugin | null> {
  try {
    let url = `/@id/${plugin}`;
    const version = new URL(import.meta.url).searchParams.get('v');
    if (version) {
      url += `?v=${version}`;
    }
    return (await import(/* @vite-ignore */ url)).default() as Plugin;
  } catch (e: any) {
    console.error(e);
    logger.error({
      message: `Failed to load plugin "${plugin}": ${e.message}.`,
      stack: e.stack,
      remarks: e.remarks,
    });
    return null;
  }
}

function consolidatePluginList(
  config: ProjectSettings,
  plugins: PluginLike[],
): PluginLike[] {
  const fullList = [
    config.plugins,
    config.scenes.flatMap(scene => scene.plugins ?? []),
    plugins,
  ];
  return fullList.flatMap(list => list ?? []);
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

type PluginLike = Plugin | string;
