import {ValueDispatcher} from '../events';
import type {Scene, Slide} from '../scenes';
import {ReadOnlyTimeEvents} from '../scenes/timeEvents';
import {Vector2} from '../types';
import {Semaphore} from '../utils';
import type {Logger} from './Logger';
import {PlaybackManager, PlaybackState} from './PlaybackManager';
import {PlaybackStatus} from './PlaybackStatus';
import type {Project} from './Project';
import {SharedWebGLContext} from './SharedWebGLContext';
import {Stage, StageSettings} from './Stage';

export interface PresenterSettings extends StageSettings {
  name: string;
  fps: number;
  slide: string | null;
}

export interface PresenterInfo extends Record<string, unknown> {
  currentSlideId: string | null;
  nextSlideId: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
  isWaiting: boolean;
  count: number;
  index: number | null;
}

export enum PresenterState {
  Initial,
  Working,
  Aborting,
}

const NextSlide = Symbol('@motion-canvas/core/app/NextSlide');
const PreviousSlide = Symbol('@motion-canvas/core/app/PreviousSlide');

export class Presenter {
  public get onStateChanged() {
    return this.state.subscribable;
  }
  private readonly state = new ValueDispatcher(PresenterState.Initial);

  public get onInfoChanged() {
    return this.info.subscribable;
  }
  private readonly info = new ValueDispatcher<PresenterInfo>({
    currentSlideId: null,
    nextSlideId: null,
    hasNext: false,
    hasPrevious: false,
    isWaiting: false,
    index: null,
    count: 0,
  });

  public get onSlidesChanged() {
    return this.slides.subscribable;
  }
  private readonly slides = new ValueDispatcher<Slide[]>([]);

  public readonly stage = new Stage();

  private readonly lock = new Semaphore();
  public readonly playback: PlaybackManager;
  private readonly status: PlaybackStatus;
  private readonly logger: Logger;
  private readonly sharedWebGLContext: SharedWebGLContext;
  private abortController: AbortController | null = null;
  private renderTime = 0;
  private requestId: number | null = null;
  private requestedResume = false;
  private requestedSlide:
    | string
    | typeof NextSlide
    | typeof PreviousSlide
    | null = null;

  public constructor(private project: Project) {
    this.logger = project.logger;
    this.playback = new PlaybackManager();
    this.status = new PlaybackStatus(this.playback);
    this.sharedWebGLContext = new SharedWebGLContext(this.logger);
    const scenes: Scene[] = [];
    for (const description of project.scenes) {
      const scene = new description.klass({
        ...description,
        meta: description.meta.clone(),
        logger: this.logger,
        playback: this.status,
        size: new Vector2(1920, 1080),
        resolutionScale: 1,
        timeEventsClass: ReadOnlyTimeEvents,
        sharedWebGLContext: this.sharedWebGLContext,
        experimentalFeatures: project.experimentalFeatures,
      });
      scenes.push(scene);
    }
    this.playback.setup(scenes);
  }

  /**
   * Present the animation.
   *
   * @param settings - The presentation settings.
   */
  public async present(settings: PresenterSettings) {
    if (this.state.current !== PresenterState.Initial) return;
    await this.lock.acquire();
    this.state.current = PresenterState.Working;
    try {
      this.abortController = new AbortController();
      await this.run(settings, this.abortController.signal);
    } catch (e: any) {
      this.project.logger.error(e);
    }

    this.sharedWebGLContext.dispose();
    this.state.current = PresenterState.Initial;
    this.lock.release();
  }

  /**
   * Abort the ongoing presentation process.
   */
  public abort() {
    if (this.state.current === PresenterState.Initial) return;
    this.abortController?.abort();
    this.state.current = PresenterState.Aborting;
  }

  /**
   * Resume the presentation if waiting for the next slide.
   */
  public resume() {
    this.requestedResume = true;
  }

  public requestFirstSlide() {
    const first = this.playback.slides[0];
    if (first) {
      this.requestedSlide = first.id;
    }
  }

  public requestLastSlide() {
    const last = this.playback.slides.at(-1);
    if (last) {
      this.requestedSlide = last.id;
    }
  }

  public requestPreviousSlide() {
    this.requestedSlide = PreviousSlide;
  }

  public requestNextSlide() {
    this.requestedSlide = NextSlide;
  }

  public requestSlide(id: string) {
    this.requestedSlide = id;
  }

  private async run(settings: PresenterSettings, signal: AbortSignal) {
    this.stage.configure(settings);
    this.playback.fps = settings.fps;

    await this.reloadScenes(settings);
    if (signal.aborted) return;
    this.playback.state = PlaybackState.Playing;
    await this.playback.recalculate();
    if (signal.aborted) return;
    this.slides.current = this.playback.slides;
    this.playback.state = PlaybackState.Presenting;
    await this.playback.reset();
    if (signal.aborted) return;

    if (settings.slide) {
      await this.playback.goTo(settings.slide);
      if (signal.aborted) return;
    }

    await new Promise(resolve => {
      signal.addEventListener('abort', resolve);
      this.request();
    });
  }

  private async reloadScenes(settings: PresenterSettings) {
    for (let i = 0; i < this.project.scenes.length; i++) {
      const description = this.project.scenes[i];
      const scene = this.playback.onScenesRecalculated.current[i];
      scene.reload({
        config: description.onReplaced.current.config,
        size: settings.size,
        resolutionScale: settings.resolutionScale,
      });
      scene.meta.set(description.meta.get());
      scene.variables.updateSignals(this.project.variables ?? {});
    }
  }

  private async loop() {
    const slide = this.requestedSlide;
    const resume = this.requestedResume;
    this.requestedResume = false;
    this.requestedSlide = null;

    // Resume the presentation
    if (resume) {
      this.playback.currentScene.slides.resume();
    }

    // Seek to the given slide
    if (slide !== null) {
      this.logger.profile('slide time');
      this.playback.state = PlaybackState.Playing;
      if (slide === PreviousSlide) {
        await this.playback.goBack();
      } else if (slide === NextSlide) {
        await this.playback.goForward();
      } else {
        await this.playback.goTo(slide);
      }
      this.logger.profile('slide time');
    }

    // Move forward one frame
    else if (!this.playback.finished) {
      this.playback.state = PlaybackState.Presenting;
      await this.playback.progress();
    }

    // Draw the project
    await this.stage.render(
      this.playback.currentScene,
      this.playback.previousScene,
    );

    if (!this.abortController?.signal.aborted) {
      this.updateInfo();
      this.request();
    }
  }

  private request() {
    if (this.abortController?.signal.aborted) {
      return;
    }

    this.requestId ??= requestAnimationFrame(async time => {
      this.requestId = null;
      if (time - this.renderTime >= 1000 / (this.status.fps + 5)) {
        this.renderTime = time;
        try {
          await this.loop();
        } catch (e: any) {
          this.logger.error(e);
          this.abortController?.abort();
        }
      } else {
        this.request();
      }
    });
  }

  private updateInfo() {
    const slides = this.playback.currentScene.slides;
    const currentSlide = slides.getCurrent() ?? null;
    const index = this.playback.slides.indexOf(currentSlide!);

    const info: PresenterInfo = {
      currentSlideId: currentSlide?.id ?? null,
      nextSlideId: this.playback.slides[index + 1]?.id ?? null,
      hasNext: index !== null && index < this.playback.slides.length - 1,
      hasPrevious: index !== null && index > 0,
      isWaiting: slides.isWaiting(),
      count: this.playback.slides.length,
      index,
    };

    for (const [key, value] of Object.entries(info)) {
      if (this.info.current[key] !== value) {
        this.info.current = info;
        break;
      }
    }
  }
}
