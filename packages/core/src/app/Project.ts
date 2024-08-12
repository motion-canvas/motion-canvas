import type {Plugin} from '../plugin';
import {FullSceneDescription} from '../scenes';
import {Logger} from './Logger';
import type {ProjectMetadata} from './ProjectMetadata';
import {SettingsMetadata} from './SettingsMetadata';

export interface ProjectSettings {
  /**
   * The name of the project.
   */
  name?: string;

  /**
   * A list of scene descriptions that make up the project.
   *
   * @remarks
   * A full scene description can be obtained by loading a scene module with a
   * `?scene` query parameter.
   *
   * @example
   * ```ts
   * import exampleScene from './example?scene';
   *
   * export default makeProject({
   *   scenes: [exampleScene],
   * });
   * ```
   */
  scenes: FullSceneDescription[];

  /**
   * A list of plugins to include in the project.
   *
   * @remarks
   * When a string is provided, the plugin will be imported dynamically using
   * the string as the module specifier. This is the preferred way to include
   * editor plugins because it makes sure that the plugin's source code gets
   * excluded from the production build.
   */
  plugins?: (Plugin | string)[];

  /**
   * A custom logger instance to use.
   */
  logger?: Logger;

  /**
   * An url for the audio track to play alongside the animation.
   *
   * @see https://motioncanvas.io/docs/media#audio
   */
  audio?: string;

  /**
   * @deprecated Configure the offset in the Video Settings tab of th editor.
   */
  audioOffset?: number;

  /**
   * Default values for project variables.
   *
   * @see https://motioncanvas.io/docs/project-variables
   */
  variables?: Record<string, unknown>;

  /**
   * Enable experimental features.
   *
   * @see https://motioncanvas.io/docs/experimental
   *
   * @experimental
   */
  experimentalFeatures?: boolean;
}

export interface Versions {
  core: string;
  two: string | null;
  ui: string | null;
  vitePlugin: string | null;
}

export interface Project {
  name: string;
  scenes: FullSceneDescription[];
  plugins: Plugin[];
  logger: Logger;
  meta: ProjectMetadata;
  settings: SettingsMetadata;
  audio?: string;
  variables?: Record<string, unknown>;
  versions: Versions;
  experimentalFeatures: boolean;
}

export function makeProject(settings: ProjectSettings) {
  return settings;
}
