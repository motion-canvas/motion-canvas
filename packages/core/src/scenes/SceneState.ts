/**
 * Describes the state of a scene.
 */
export enum SceneState {
  /**
   * The scene has just been created/reset.
   */
  Initial,

  /**
   * The scene has finished transitioning in.
   *
   * @remarks
   * Informs the Project that the previous scene is no longer necessary and can
   * be disposed of.
   */
  AfterTransitionIn,

  /**
   * The scene is ready to transition out.
   *
   * @remarks
   * Informs the project that the next scene can begin.
   * The {@link Scene.next} method will still be invoked until the next scene
   * enters {@link AfterTransitionIn}.
   */
  CanTransitionOut,

  /**
   * The scene has finished.
   *
   * @remarks
   * Invoking {@link Scene.next} won't have any effect.
   */
  Finished,
}
