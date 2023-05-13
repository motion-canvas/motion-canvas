import {Logger} from './Logger';
import {Project, ProjectSettings, Versions} from './Project';
import {ProjectMetadata} from './ProjectMetadata';
import {Plugin} from '../plugin';
import {MetaFile} from '../meta';

/**
 * Bootstrap a project.
 *
 * @param name - The name of the project.
 * @param versions - Package versions.
 * @param plugins - Loaded plugins.
 * @param settings - Project settings.
 * @param metaFile - The meta file.
 *
 * @internal
 */
export function bootstrap(
  name: string,
  versions: Versions,
  plugins: Plugin[],
  settings: ProjectSettings,
  metaFile: MetaFile<any>,
): Project {
  const reducedSettings = plugins.reduce(
    (settings, plugin) => ({
      ...settings,
      ...(plugin.settings?.(settings) ?? {}),
    }),
    {name, ...settings} as ProjectSettings,
  );

  const project = {...reducedSettings} as Project;
  project.versions = versions;
  project.logger = new Logger();
  project.plugins = plugins;
  project.meta = new ProjectMetadata(project);
  metaFile.attach(project.meta);

  plugins.forEach(plugin => plugin.project?.(project));

  return project;
}
