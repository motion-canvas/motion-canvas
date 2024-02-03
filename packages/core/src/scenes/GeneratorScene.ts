import {Logger, PlaybackStatus} from '../app';
import {decorate, threadable} from '../decorators';
import {EventDispatcher, ValueDispatcher} from '../events';
import {DependencyContext, SignalValue} from '../signals';
import {
  Thread,
  ThreadGenerator,
  isPromisable,
  isPromise,
  threads,
} from '../threading';
import {Vector2} from '../types';
import {endPlayback, endScene, startPlayback, startScene} from '../utils';
import {LifecycleEvents} from './LifecycleEvents';
import {Random} from './Random';
import {
  CachedSceneData,
  FullSceneDescription,
  Scene,
  SceneDescriptionReload,
  SceneRenderEvent,
} from './Scene';
import {SceneMetadata} from './SceneMetadata';
import {SceneState} from './SceneState';
import {Shaders} from './Shaders';
import {Slides} from './Slides';
import {Threadable} from './Threadable';
import {Variables} from './Variables';
import {TimeEvents} from './timeEvents';

export interface ThreadGeneratorFactory<T> {
  (view: T): ThreadGenerator;
}

/**
 * The default implementation of the {@link Scene} interface.
 *
 * Uses generators to control the animation.
 */
export abstract class GeneratorScene<T>
  implements Scene<ThreadGeneratorFactory<T>>, Threadable
{
  public readonly name: string;
  public readonly playback: PlaybackStatus;
  public readonly logger: Logger;
  public readonly meta: SceneMetadata;
  public readonly timeEvents: TimeEvents;
  public readonly shaders: Shaders;
  public readonly slides: Slides;
  public readonly variables: Variables;
  public random: Random;
  public creationStack?: string;
  public previousOnTop: SignalValue<boolean>;

  public get firstFrame() {
    return this.cache.current.firstFrame;
  }

  public get lastFrame() {
    return this.firstFrame + this.cache.current.duration;
  }

  public get onCacheChanged() {
    return this.cache.subscribable;
  }
  private readonly cache = new ValueDispatcher<CachedSceneData>({
    firstFrame: 0,
    transitionDuration: 0,
    duration: 0,
    lastFrame: 0,
  });

  public get onReloaded() {
    return this.reloaded.subscribable;
  }
  private readonly reloaded = new EventDispatcher<void>();

  public get onRecalculated() {
    return this.recalculated.subscribable;
  }
  private readonly recalculated = new EventDispatcher<void>();

  public get onThreadChanged() {
    return this.thread.subscribable;
  }
  private readonly thread = new ValueDispatcher<Thread | null>(null);

  public get onRenderLifecycle() {
    return this.renderLifecycle.subscribable;
  }
  protected readonly renderLifecycle = new EventDispatcher<
    [SceneRenderEvent, CanvasRenderingContext2D]
  >();

  public get onReset() {
    return this.afterReset.subscribable;
  }
  private readonly afterReset = new EventDispatcher<void>();

  public readonly lifecycleEvents: LifecycleEvents = new LifecycleEvents(this);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public get LifecycleEvents() {
    this.logger.warn(
      'LifecycleEvents is deprecated. Use lifecycleEvents instead.',
    );
    return this.lifecycleEvents;
  }

  public get previous() {
    return this.previousScene;
  }

  public readonly experimentalFeatures: boolean;

  protected resolutionScale: number;
  private runnerFactory: ThreadGeneratorFactory<T>;
  private previousScene: Scene | null = null;
  private runner: ThreadGenerator | null = null;
  private state: SceneState = SceneState.Initial;
  private cached = false;
  private counters: Record<string, number> = {};
  private size: Vector2;

  public constructor(
    description: FullSceneDescription<ThreadGeneratorFactory<T>>,
  ) {
    this.name = description.name;
    this.size = description.size;
    this.resolutionScale = description.resolutionScale;
    this.logger = description.logger;
    this.playback = description.playback;
    this.meta = description.meta;
    this.runnerFactory = description.config;
    this.creationStack = description.stack;
    this.experimentalFeatures = description.experimentalFeatures ?? false;

    decorate(this.runnerFactory, threadable(this.name));
    this.timeEvents = new description.timeEventsClass(this);
    this.variables = new Variables(this);
    this.shaders = new Shaders(this, description.sharedWebGLContext);
    this.slides = new Slides(this);

    this.random = new Random(this.meta.seed.get());
    this.previousOnTop = false;
  }

  public abstract getView(): T;

  /**
   * Update the view.
   *
   * Invoked after each step of the main generator.
   * Can be used for calculating layout.
   *
   * Can modify the state of the view.
   */
  public update() {
    // do nothing
  }

  public async render(context: CanvasRenderingContext2D): Promise<void> {
    let iterations = 0;
    do {
      iterations++;
      await DependencyContext.consumePromises();
      context.save();
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      this.execute(() => this.draw(context));
      context.restore();
    } while (DependencyContext.hasPromises() && iterations < 10);

    if (iterations > 1) {
      this.logger.debug(`render iterations: ${iterations}`);
    }
  }

  protected abstract draw(context: CanvasRenderingContext2D): void;

  public reload({
    config,
    size,
    stack,
    resolutionScale,
  }: SceneDescriptionReload<ThreadGeneratorFactory<T>> = {}) {
    if (config) {
      this.runnerFactory = config;
    }
    if (size) {
      this.size = size;
    }
    if (resolutionScale) {
      this.resolutionScale = resolutionScale;
    }
    if (stack) {
      this.creationStack = stack;
    }
    this.cached = false;
    this.reloaded.dispatch();
  }

  public async recalculate(setFrame: (frame: number) => void) {
    const cached = this.cache.current;
    cached.firstFrame = this.playback.frame;
    cached.lastFrame = cached.firstFrame + cached.duration;

    if (this.isCached()) {
      setFrame(cached.lastFrame);
      this.cache.current = {...cached};
      return;
    }

    cached.transitionDuration = -1;
    await this.reset();
    while (!this.canTransitionOut()) {
      if (
        cached.transitionDuration < 0 &&
        this.state === SceneState.AfterTransitionIn
      ) {
        cached.transitionDuration = this.playback.frame - cached.firstFrame;
      }
      setFrame(this.playback.frame + 1);
      await this.next();
    }

    if (cached.transitionDuration === -1) {
      cached.transitionDuration = 0;
    }

    cached.lastFrame = this.playback.frame;
    cached.duration = cached.lastFrame - cached.firstFrame;
    // Prevent the page from becoming unresponsive.
    await new Promise(resolve => setTimeout(resolve, 0));
    this.cached = true;
    this.cache.current = {...cached};
    this.recalculated.dispatch();
  }

  public async next() {
    if (!this.runner) {
      return;
    }

    let result = this.execute(() => this.runner!.next());
    this.update();
    while (result.value) {
      if (isPromisable(result.value)) {
        const value = await result.value.toPromise();
        result = this.execute(() => this.runner!.next(value));
      } else if (isPromise(result.value)) {
        const value = await result.value;
        result = this.execute(() => this.runner!.next(value));
      } else {
        this.logger.warn({
          message: 'Invalid value yielded by the scene.',
          object: result.value,
        });
        result = this.execute(() => this.runner!.next(result.value));
      }
      this.update();
    }

    if (DependencyContext.hasPromises()) {
      const promises = await DependencyContext.consumePromises();
      this.logger.error({
        message:
          'Tried to access an asynchronous property before the node was ready. ' +
          'Make sure to yield the node before accessing the property.',
        stack: promises[0].stack,
        inspect: promises[0].owner?.key ?? undefined,
      });
    }

    if (result.done) {
      this.state = SceneState.Finished;
    }
  }

  public async reset(previousScene: Scene | null = null) {
    this.counters = {};
    this.previousScene = previousScene;
    this.previousOnTop = false;
    this.random = new Random(this.meta.seed.get());
    this.runner = threads(
      () => this.runnerFactory(this.getView()),
      thread => {
        this.thread.current = thread;
      },
    );
    this.state = SceneState.AfterTransitionIn;
    this.afterReset.dispatch();
    await this.next();
  }

  public getSize(): Vector2 {
    return this.size;
  }

  public getRealSize(): Vector2 {
    return this.size.mul(this.resolutionScale);
  }

  public isAfterTransitionIn(): boolean {
    return this.state === SceneState.AfterTransitionIn;
  }

  public canTransitionOut(): boolean {
    return (
      this.state === SceneState.CanTransitionOut ||
      this.state === SceneState.Finished
    );
  }

  public isFinished(): boolean {
    return this.state === SceneState.Finished;
  }

  public enterInitial() {
    if (this.state === SceneState.AfterTransitionIn) {
      this.state = SceneState.Initial;
    } else {
      this.logger.warn(
        `Scene ${this.name} entered initial in an unexpected state: ${this.state}`,
      );
    }
  }

  public enterAfterTransitionIn() {
    if (this.state === SceneState.Initial) {
      this.state = SceneState.AfterTransitionIn;
    } else {
      this.logger.warn(
        `Scene ${this.name} transitioned in an unexpected state: ${this.state}`,
      );
    }
  }

  public enterCanTransitionOut() {
    if (
      this.state === SceneState.AfterTransitionIn ||
      this.state === SceneState.Initial // only on recalculate
    ) {
      this.state = SceneState.CanTransitionOut;
    } else {
      this.logger.warn(
        `Scene ${this.name} was marked as finished in an unexpected state: ${this.state}`,
      );
    }
  }

  public isCached() {
    return this.cached;
  }

  /**
   * Invoke the given callback in the context of this scene.
   *
   * @remarks
   * This method makes sure that the context of this scene is globally available
   * during the execution of the callback.
   *
   * @param callback - The callback to invoke.
   */
  protected execute<T>(callback: () => T): T {
    let result: T;
    startScene(this);
    startPlayback(this.playback);
    try {
      result = callback();
    } finally {
      endPlayback(this.playback);
      endScene(this);
    }

    return result;
  }
}
