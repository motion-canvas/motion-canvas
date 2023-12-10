import type {Plugin} from '../plugin';
import {FullSceneDescription} from '../scenes';
import {Logger} from './Logger';
import type {ProjectMetadata} from './ProjectMetadata';
import {SettingsMetadata} from './SettingsMetadata';

export interface ProjectSettings {
  name?: string;
  scenes: FullSceneDescription[];
  plugins?: Plugin[];
  logger?: Logger;
  audio?: string;
  /**
   * @deprecated Configure the offset in the Video Settings tab of th editor.
   */
  audioOffset?: number;
  variables?: Record<string, unknown>;
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
}

export function makeProject(settings: ProjectSettings) {
  return settings;
}
