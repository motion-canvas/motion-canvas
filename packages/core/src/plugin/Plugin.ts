import type {Exporter, Project} from '../app';

/**
 * Represents a runtime Motion Canvas plugin.
 */
export interface Plugin {
  name: string;
  exporters?(project: Project): Exporter[];
}
