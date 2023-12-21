import type {
  ExporterClass,
  Player,
  Presenter,
  Project,
  ProjectSettings,
  Renderer,
} from '../app';

/**
 * Represents a runtime Motion Canvas plugin.
 */
export interface Plugin {
  name: string;

  /**
   * A path for importing the editor plugin.
   *
   * @remarks
   * Editor plugins can extend the editor UI. They are loaded only when using
   * the editor and are ignored completely in a production build.
   *
   * The path should lead to a module containing a default export of an editor
   * plugin.
   *
   * @experimental
   */
  editorPlugin?: string;

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
   * Receive the presenter instance right after it is initialized.
   *
   * @param presenter - The presenter instance.
   */
  presenter?(presenter: Presenter): void;

  /**
   * Receive the renderer instance right after it is initialized.
   *
   * @param renderer - The renderer instance.
   */
  renderer?(renderer: Renderer): void;

  /**
   * Provide custom exporters for the project.
   *
   * @param project - The project instance.
   */
  exporters?(project: Project): ExporterClass[];
}
