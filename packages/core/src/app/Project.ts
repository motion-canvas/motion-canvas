import {FullSceneDescription} from '../scenes';
import {Logger} from './Logger';
import {ProjectMetadata} from './ProjectMetadata';

export interface ProjectSettings {
  name?: string;
  scenes: FullSceneDescription[];
  logger?: Logger;
  audio?: string;
  audioOffset?: number;
  variables?: Record<string, unknown>;
}

export interface Project {
  name: string;
  scenes: FullSceneDescription[];
  logger: Logger;
  meta: ProjectMetadata;
  audio?: string;
  audioOffset?: number;
  variables?: Record<string, unknown>;
}

export function makeProject(settings: ProjectSettings) {
  return {
    logger: new Logger(),
    meta: new ProjectMetadata(),
    ...settings,
  };
}
