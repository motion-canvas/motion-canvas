import {
  isPromisable,
  isPromise,
  Thread,
  ThreadGenerator,
  threads,
} from '../threading';
import {Meta} from '../Meta';
import {TimeEvents} from './TimeEvents';
import {EventDispatcher, ValueDispatcher} from '../events';
import {Project} from '../Project';
import {decorate, threadable} from '../decorators';
import {endScene, setProject, startScene} from '../utils';
import {CachedSceneData, Scene, SceneMetadata, SceneRenderEvent} from './Scene';
import {LifecycleEvents} from './LifecycleEvents';
import {Threadable} from './Threadable';
import {Rect, Vector2} from '../types';
import {SceneState} from './SceneState';
import {Random} from './Random';
import {DependencyContext} from '../signals';

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
  public readonly timeEvents: TimeEvents;
  public random: Random;

  public get project(): Project {
    if (!this.currentProject) {
      throw new Error(`Project for Scene ${this.name} has not been set.`);
    }
    return this.currentProject;
  }
  public set project(value: Project) {
    this.currentProject = value;
  }

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

  public readonly LifecycleEvents: LifecycleEvents = new LifecycleEvents(this);

  public get previous() {
    return this.previousScene;
  }

  private previousScene: Scene | null = null;
  private currentProject: Project | null = null;
  private runner: ThreadGenerator | null = null;
  private state: SceneState = SceneState.Initial;
  private cached = false;
  private counters: Record<string, number> = {};

  public constructor(
    public readonly name: string,
    public readonly meta: Meta<SceneMetadata>,
    private runnerFactory: ThreadGeneratorFactory<T>,
  ) {
    decorate(this.runnerFactory, threadable(name));
    this.timeEvents = new TimeEvents(this);

    let seed = this.meta.getData().seed;
    if (typeof seed !== 'number') {
      seed = Random.createSeed();
      this.meta.setDataSync({seed});
    }

    this.random = new Random(seed);
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
    let promises = DependencyContext.consumePromises();
    let iterations = 0;
    startScene(this);
    do {
      iterations++;
      await Promise.all(promises.map(handle => handle.promise));
      context.save();
      const rect = Rect.fromSizeCentered(this.getSize());
      context.clearRect(rect.x, rect.y, rect.width, rect.height);
      this.draw(context);
      context.restore();

      promises = DependencyContext.consumePromises();
    } while (promises.length > 0 && iterations < 10);
    endScene(this);

    if (iterations > 1) {
      this.project.logger.debug(`render iterations: ${iterations}`);
    }
  }

  protected abstract draw(context: CanvasRenderingContext2D): void;

  public reload(runnerFactory?: ThreadGeneratorFactory<T>) {
    if (runnerFactory) {
      this.runnerFactory = runnerFactory;
    }
    this.cached = false;
    this.reloaded.dispatch();
  }

  public async recalculate() {
    const cached = this.cache.current;
    cached.firstFrame = this.project.frame;
    cached.lastFrame = cached.firstFrame + cached.duration;

    if (this.isCached()) {
      this.project.frame = cached.lastFrame;
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
        cached.transitionDuration = this.project.frame - cached.firstFrame;
      }
      this.project.frame++;
      await this.next();
    }

    if (cached.transitionDuration === -1) {
      cached.transitionDuration = 0;
    }

    cached.lastFrame = this.project.frame;
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

    startScene(this);
    setProject(this.project);
    let result = this.runner.next();
    this.update();
    while (result.value) {
      if (isPromisable(result.value)) {
        result = this.runner.next(await result.value.toPromise());
      } else if (isPromise(result.value)) {
        result = this.runner.next(await result.value);
      } else {
        this.project.logger.warn({
          message: 'Invalid value yielded by the scene.',
          object: result.value,
        });
        result = this.runner.next(result.value);
      }
      this.update();
    }
    endScene(this);

    const promises = DependencyContext.consumePromises();
    if (promises.length > 0) {
      await Promise.all(promises.map(handle => handle.promise));
      this.project.logger.error({
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
    this.random = new Random(this.meta.getData().seed!);
    this.runner = threads(
      () => this.runnerFactory(this.getView()),
      thread => {
        this.thread.current = thread;
      },
    );
    if (this.cache.current.transitionDuration === 0) {
      this.state = SceneState.AfterTransitionIn;
    } else {
      this.state = SceneState.Initial;
    }
    this.afterReset.dispatch();
    await this.next();
  }

  public getSize(): Vector2 {
    return this.project.getSize();
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

  public enterAfterTransitionIn() {
    if (this.state === SceneState.Initial) {
      this.state = SceneState.AfterTransitionIn;
    } else {
      this.project.logger.warn(
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
      this.project.logger.warn(
        `Scene ${this.name} was marked as finished in an unexpected state: ${this.state}`,
      );
    }
  }

  public isCached() {
    return this.cached;
  }
}
