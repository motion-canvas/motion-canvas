import type {ExporterClass, Project, Player, ProjectSettings} from '../app';

/**
 * Represents a runtime Motion Canvas plugin.
 */
export interface Plugin {
  name: string;

  /**
   * Modify the project settings before the project is initialized.
   *
   * @param settings - The project settings.
   */
  settings?(settings: ProjectSettings): ProjectSettings | void;

  /**
   * Receive the project instance right after it is initialized.
   *
   * @param project - The project instance.
   */
  project?(project: Project): void;

  /**
   * Receive the player instance right after it is initialized.
   *
   * @param player - The player instance.
   */
  player?(player: Player): void;

  /**
   * Provide custom exporters for the project.
   *
   * @param project - The project instance.
   */
  exporters?(project: Project): ExporterClass[];
}
