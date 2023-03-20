import {FullSceneDescription} from '../scenes';
import {Logger} from './Logger';
import type {ProjectMetadata} from './ProjectMetadata';
import type {Plugin} from '../plugin';

export interface ProjectSettings {
  name?: string;
  scenes: FullSceneDescription[];
  plugins?: Plugin[];
  logger?: Logger;
  audio?: string;
  audioOffset?: number;
  variables?: Record<string, unknown>;
}

export interface Project {
  name: string;
  scenes: FullSceneDescription[];
  plugins: Plugin[];
  logger: Logger;
  meta: ProjectMetadata;
  audio?: string;
  audioOffset?: number;
  variables?: Record<string, unknown>;
  versions: {
    core: string;
    two: string | null;
    ui: string | null;
    vitePlugin: string | null;
  };
}

export function makeProject(settings: ProjectSettings) {
  return {
    logger: new Logger(),
    plugins: [],
    ...settings,
  };
}
