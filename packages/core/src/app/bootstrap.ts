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
 *
 * @internal
 */
export function bootstrap(
  name: string,
  versions: Versions,
  plugins: Plugin[],
  config: ProjectSettings,
  metaFile: MetaFile<any>,
  settingsFile: MetaFile<any>,
  logger = config.logger ?? new Logger(),
): Project {
  const settings = createSettingsMetadata();
  settingsFile.attach(settings);

  const project = {
    name,
    ...config,
    plugins,
    versions,
    settings,
    logger,
  } as Project;

  project.meta = new ProjectMetadata(project);
  project.meta.shared.set(settings.defaults.get());
  project.experimentalFeatures ??= false;
  metaFile.attach(project.meta);

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
  plugins: (Plugin | string)[],
  config: ProjectSettings,
  metaFile: MetaFile<any>,
  settingsFile: MetaFile<any>,
): Promise<Project> {
  const logger = config.logger ?? new Logger();
  const promises: Promise<Plugin | null>[] = [Promise.resolve(DefaultPlugin())];

  if (config.plugins) {
    for (const plugin of config.plugins) {
      promises.push(parsePlugin(plugin, logger));
    }
  }

  for (const scene of config.scenes) {
    if (scene.plugins) {
      for (const plugin of scene.plugins) {
        promises.push(parsePlugin(plugin, logger));
      }
    }
  }

  for (const plugin of plugins) {
    promises.push(parsePlugin(plugin, logger));
  }

  const pluginSet = new Set<string>();
  const resolvedPlugins = await Promise.all(promises);
  const includedPlugins: Plugin[] = [];
  let resolvedConfig = config;

  for (const plugin of resolvedPlugins) {
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

  const project = bootstrap(
    name,
    versions,
    includedPlugins,
    resolvedConfig,
    metaFile,
    settingsFile,
  );

  includedPlugins.forEach(plugin => plugin.project?.(project));

  return project;
}

async function parsePlugin(
  plugin: Plugin | string,
  logger: Logger,
): Promise<Plugin | null> {
  if (typeof plugin === 'string') {
    try {
      let url = `/@id/${plugin}`;
      const version = new URL(import.meta.url).searchParams.get('v');
      if (version) {
        url += `?v=${version}`;
      }
      plugin = (await import(/* @vite-ignore */ url)).default() as Plugin;
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

  return plugin;
}
