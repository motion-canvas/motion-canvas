import {isPromise, Thread, ThreadGenerator, threads} from '../threading';
import {Meta} from '../Meta';
import {TimeEvents} from './TimeEvents';
import {EventDispatcher, ValueDispatcher} from '../events';
import {Project} from '../Project';
import {decorate, threadable} from '../decorators';
import {setScene} from '../utils';
import {CachedSceneData, Scene, SceneMetadata} from './Scene';
import {
  isTransitionable,
  SceneTransition,
  Transitionable,
  TransitionContext,
} from './Transitionable';
import {Threadable} from './Threadable';
import {Size} from '../types';
import {SceneState} from './SceneState';

export interface ThreadGeneratorFactory<T> {
  (view: T): ThreadGenerator;
}

/**
 * The default implementation of the {@link Scene} interface.
 *
 * Uses generators to control the animation.
 */
export abstract class GeneratorScene<T>
  implements Scene<ThreadGeneratorFactory<T>>, Transitionable, Threadable
{
  public readonly timeEvents: TimeEvents;
  public readonly meta: Meta<SceneMetadata>;

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
  private readonly thread = new ValueDispatcher<Thread>(null);

  private previousScene: Scene = null;
  private runner: ThreadGenerator;
  private state: SceneState = SceneState.Initial;
  private cached = false;
  private counters: Record<string, number> = {};

  public constructor(
    public readonly project: Project,
    public readonly name: string,
    private runnerFactory: ThreadGeneratorFactory<T>,
  ) {
    decorate(this.runnerFactory, threadable(name));

    this.meta = Meta.getMetaFor(`${name}.scene`);
    this.timeEvents = new TimeEvents(this);
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

  public abstract render(
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ): void;

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
      if (cached.transitionDuration < 0 && this.isAfterTransitionIn()) {
        cached.transitionDuration = this.project.frame - cached.firstFrame;
      }
      this.project.frame++;
      await this.next();
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
    setScene(this);
    let result = this.runner.next();
    this.update();
    while (result.value) {
      if (isPromise(result.value)) {
        const value = await result.value;
        result = this.runner.next(value);
      } else {
        console.warn('Invalid value: ', result.value);
        result = this.runner.next();
      }
      this.update();
    }

    if (result.done) {
      this.state = SceneState.Finished;
    }
  }

  public async reset(previousScene: Scene = null) {
    this.counters = {};
    this.previousScene = previousScene;
    this.runner = threads(
      () => this.runnerFactory(this.getView()),
      thread => {
        this.thread.current = thread;
      },
    );
    this.state = SceneState.Initial;
    setScene(this);
    await this.next();
  }

  public getSize(): Size {
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

  public enterCanTransitionOut() {
    if (this.state === SceneState.AfterTransitionIn) {
      this.state = SceneState.CanTransitionOut;
    } else {
      console.warn(
        `Scene ${this.name} was marked as finished in an unexpected state: `,
        this.state,
      );
    }
  }

  public enterAfterTransitionIn() {
    if (this.state === SceneState.Initial) {
      this.state = SceneState.AfterTransitionIn;
    } else {
      console.warn(
        `Scene ${this.name} transitioned in an unexpected state: `,
        this.state,
      );
    }
  }

  public isCached() {
    return this.cached;
  }

  public generateNodeId(type: string): string {
    let id = 0;
    if (type in this.counters) {
      id = ++this.counters[type];
    } else {
      this.counters[type] = id;
    }

    return `${this.name}.${type}.${id}`;
  }

  //#region Transitionable Interface

  @threadable()
  public *transition(transitionRunner?: SceneTransition): ThreadGenerator {
    const previous = isTransitionable(this.previousScene)
      ? this.previousScene.getTransitionContext()
      : null;

    if (!transitionRunner) {
      previous?.visible(false);
      this.enterAfterTransitionIn();
      return;
    }

    yield* transitionRunner(this.getTransitionContext(), previous);
    this.enterAfterTransitionIn();
  }

  public abstract getTransitionContext(): TransitionContext;

  //#endregion
}
