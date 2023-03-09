import type {RendererResult, RendererSettings} from './Renderer';

/**
 * The main interface for implementing custom exporters.
 */
export interface Exporter {
  /**
   * Prepare the rendering configuration.
   *
   * @remarks
   * Called at the beginning of the rendering process, before anything else has
   * been set up. The returned value can be used to override the rendering
   * settings provided by the user.
   *
   * @param settings - Rendering settings provided by the user.
   */
  configure(settings: RendererSettings): Promise<RendererSettings | void>;

  /**
   * Begin the rendering process.
   *
   * @remarks
   * Called after the rendering has been set up, right before the first frame
   * is rendered. Once `start()` is called, it is guaranteed that the `stop()`
   * method will be called as well. Can be used to initialize any resources that
   * require clean-up.
   */
  start(): Promise<void>;

  /**
   * Export a frame.
   *
   * @remarks
   * Called each time after a frame is rendered.
   *
   * @param canvas - A canvas containing the rendered frame.
   * @param frame - The frame number.
   * @param sceneFrame - The frame number within the scene.
   * @param sceneName - The name of the scene with which the frame is associated.
   * @param signal - An abort signal triggered if the user aborts the rendering.
   */
  handleFrame(
    canvas: HTMLCanvasElement,
    frame: number,
    sceneFrame: number,
    sceneName: string,
    signal: AbortSignal,
  ): Promise<void>;

  /**
   * Finish the rendering process.
   *
   * @remarks
   * Guaranteed to be called after the rendering has finished - no matter the
   * result. Can be used to finalize the exporting and perform any necessary
   * clean up.
   *
   * @param result - The result of the rendering.
   */
  stop(result: RendererResult): Promise<void>;
}
