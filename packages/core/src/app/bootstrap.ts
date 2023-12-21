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
): Project {
  const settings = createSettingsMetadata();
  settingsFile.attach(settings);

  const defaultPlugin = DefaultPlugin();
  const pluginMap = new Map<string, Plugin>([
    [defaultPlugin.name, defaultPlugin],
  ]);

  if (config.plugins) {
    for (const plugin of config.plugins) {
      pluginMap.set(plugin.name, plugin);
    }
  }

  for (const scene of config.scenes) {
    if (scene.plugins) {
      for (const plugin of scene.plugins) {
        pluginMap.set(plugin.name, plugin);
      }
    }
  }

  for (const plugin of plugins) {
    pluginMap.set(plugin.name, plugin);
  }

  // Make sure the default plugin is not overridden.
  pluginMap.set(defaultPlugin.name, defaultPlugin);
  plugins = [...pluginMap.values()];

  const reducedSettings = plugins.reduce(
    (settings, plugin) => ({
      ...settings,
      ...(plugin.settings?.(settings) ?? {}),
    }),
    {name, ...config} as ProjectSettings,
  );

  const project = {...reducedSettings} as Project;
  project.versions = versions;
  project.logger = new Logger();
  project.plugins = plugins;
  project.settings = settings;
  project.meta = new ProjectMetadata(project);
  project.meta.shared.set(settings.defaults.get());
  project.experimentalFeatures ??= false;
  metaFile.attach(project.meta);

  plugins.forEach(plugin => plugin.project?.(project));

  return project;
}
