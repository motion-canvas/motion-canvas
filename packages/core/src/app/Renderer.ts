import type {Project} from './Project';
import type {Exporter} from './Exporter';
import type {Scene} from '../scenes';
import {PlaybackManager, PlaybackState} from './PlaybackManager';
import {Stage, StageSettings} from './Stage';
import {EventDispatcher, ValueDispatcher} from '../events';
import {ImageExporter} from './ImageExporter';
import {CanvasOutputMimeType, Vector2} from '../types';
import {PlaybackStatus} from './PlaybackStatus';
import {Semaphore} from '../utils';
import {ReadOnlyTimeEvents} from '../scenes/timeEvents';

export interface RendererSettings extends StageSettings {
  name: string;
  range: [number, number];
  fps: number;
  fileType: CanvasOutputMimeType;
  quality: number;
  groupByScene: boolean;
}

export enum RendererState {
  Initial,
  Working,
  Aborting,
}

export enum RendererResult {
  Success,
  Error,
  Aborted,
}

/**
 * The rendering logic used by the editor to export animations.
 *
 * @remarks
 * This class uses the {@link PlaybackManager} to render animations.
 * In contrast to a player, a renderer does not use an update loop.
 * It plays through the animation as fast as it can, occasionally pausing
 * to keep the UI responsive.
 *
 * The actual exporting is outsourced to an {@link Exporter}.
 */
export class Renderer {
  public get onStateChanged() {
    return this.state.subscribable;
  }
  private readonly state = new ValueDispatcher(RendererState.Initial);

  public get onFinished() {
    return this.finished.subscribable;
  }
  private readonly finished = new EventDispatcher<RendererResult>();

  public get onFrameChanged() {
    return this.frame.subscribable;
  }
  private readonly frame = new ValueDispatcher(0);

  public readonly stage = new Stage();

  private readonly lock = new Semaphore();
  private readonly playback: PlaybackManager;
  private readonly status: PlaybackStatus;
  private readonly exporter: Exporter = new ImageExporter(this.project.logger);
  private abortController: AbortController | null = null;

  public constructor(private project: Project) {
    this.playback = new PlaybackManager();
    this.status = new PlaybackStatus(this.playback);
    const scenes: Scene[] = [];
    for (const description of project.scenes) {
      const scene = new description.klass({
        ...description,
        meta: description.meta.clone(),
        logger: this.project.logger,
        playback: this.status,
        size: new Vector2(1920, 1080),
        resolutionScale: 1,
        timeEventsClass: ReadOnlyTimeEvents,
      });
      scenes.push(scene);
    }
    this.playback.setup(scenes);
  }

  /**
   * Render the animation using the provided settings.
   *
   * @param settings - The rendering settings.
   */
  public async render(settings: RendererSettings) {
    if (this.state.current !== RendererState.Initial) return;
    await this.lock.acquire();
    this.state.current = RendererState.Working;
    let result: RendererResult;
    try {
      this.abortController = new AbortController();
      result = await this.run(settings, this.abortController.signal);
    } catch (e: any) {
      this.project.logger.error(e);
      result = RendererResult.Error;
    }

    this.state.current = RendererState.Initial;
    this.finished.dispatch(result);
    this.lock.release();
  }

  /**
   * Abort the ongoing render process.
   */
  public abort() {
    if (this.state.current !== RendererState.Working) return;
    this.abortController?.abort();
    this.state.current = RendererState.Aborting;
  }

  /**
   * Export an individual frame.
   *
   * @remarks
   * This method always uses the default {@link ImageExporter}.
   *
   * @param settings - The rendering settings.
   * @param frame - The frame to export.
   */
  public async renderFrame(settings: RendererSettings, frame: number) {
    await this.lock.acquire();

    try {
      this.stage.configure(settings);
      this.playback.fps = settings.fps;
      this.playback.state = PlaybackState.Rendering;

      await this.reloadScenes(settings);
      await this.playback.reset();
      await this.playback.seek(this.status.secondsToFrames(settings.range[0]));
      await this.stage.render(
        this.playback.currentScene!,
        this.playback.previousScene,
      );

      if (import.meta.hot) {
        import.meta.hot.send('motion-canvas:export', {
          frameNumber: frame,
          data: this.stage.finalBuffer.toDataURL(
            settings.fileType,
            settings.quality,
          ),
          mimeType: settings.fileType,
          subDirectories: ['still', this.project.name],
        });
      }
    } catch (e: any) {
      this.project.logger.error(e);
    }

    this.lock.release();
  }

  private async run(
    settings: RendererSettings,
    signal: AbortSignal,
  ): Promise<RendererResult> {
    settings = (await this.exporter.configure(settings)) ?? settings;
    this.stage.configure(settings);
    this.playback.fps = settings.fps;
    this.playback.state = PlaybackState.Rendering;
    const from = this.status.secondsToFrames(settings.range[0]);
    const to = this.status.secondsToFrames(settings.range[1]);

    await this.reloadScenes(settings);
    if (signal.aborted) return RendererResult.Aborted;
    await this.playback.reset();
    if (signal.aborted) return RendererResult.Aborted;
    await this.playback.seek(from);
    if (signal.aborted) return RendererResult.Aborted;

    await this.exporter.start();

    let lastRefresh = performance.now();
    let result = RendererResult.Success;
    try {
      await this.exportFrame(signal);
      if (signal.aborted) {
        result = RendererResult.Aborted;
      } else {
        let finished = false;
        while (!finished) {
          await this.playback.progress();
          await this.exportFrame(signal);
          if (performance.now() - lastRefresh > 1 / 30) {
            lastRefresh = performance.now();
            await new Promise(resolve => setTimeout(resolve, 0));
          }
          if (this.playback.finished || this.playback.frame >= to) {
            finished = true;
          }
          if (signal.aborted) {
            result = RendererResult.Aborted;
            finished = true;
          }
        }
      }
    } catch (e: any) {
      this.project.logger.error(e);
      result = RendererResult.Error;
    }

    await this.exporter.stop(result);
    return result;
  }

  private async reloadScenes(settings: RendererSettings) {
    for (let i = 0; i < this.project.scenes.length; i++) {
      const description = this.project.scenes[i];
      const scene = this.playback.onScenesRecalculated.current[i];
      scene.reload({
        config: description.onReplaced.current.config,
        size: settings.size,
        resolutionScale: settings.resolutionScale,
      });
      scene.meta.set(description.meta.get());
    }
  }

  private async exportFrame(signal: AbortSignal) {
    this.frame.current = this.playback.frame;
    await this.stage.render(
      this.playback.currentScene!,
      this.playback.previousScene,
    );
    await this.exporter.handleFrame(
      this.stage.finalBuffer,
      this.playback.frame,
      this.playback.currentScene.name,
      signal,
    );
  }
}
