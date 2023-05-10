import type {ExporterClass, Project} from '../app';

/**
 * Represents a runtime Motion Canvas plugin.
 */
export interface Plugin {
  name: string;
  exporters?(project: Project): ExporterClass[];
}
