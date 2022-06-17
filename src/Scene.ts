import type {Project} from './Project';
import {LayerConfig} from 'konva/lib/Layer';
import {
  isPromise,
  ThreadGenerator,
  threads,
  ThreadsCallback,
} from './threading';
import {Group} from 'konva/lib/Group';
import {Shape} from 'konva/lib/Shape';
import {SceneTransition} from './transitions';
import {decorate, KonvaNode, threadable} from './decorators';
import {setScene} from './utils';
import {Meta, Metadata} from './Meta';
import {SavedTimeEvent, TimeEvents} from './TimeEvents';

export interface SceneRunner {
  (layer: Scene, project: Project): ThreadGenerator;
}

export enum SceneState {
  Initial,
  AfterTransitionIn,
  CanTransitionOut,
  Finished,
}

export interface SceneMetadata extends Metadata {
  timeEvents: SavedTimeEvent[];
}

@KonvaNode()
export class Scene extends Group {
  public threadsCallback: ThreadsCallback = null;
  public firstFrame = 0;
  public transitionDuration = 0;
  public duration = 0;
  public readonly meta: Meta<SceneMetadata>;
  public readonly timeEvents: TimeEvents;

  public get lastFrame() {
    return this.firstFrame + this.duration;
  }
  public set lastFrame(value: number) {
    this.duration = value - this.firstFrame;
  }

  private previousScene: Scene = null;
  private runner: ThreadGenerator;
  private state: SceneState = SceneState.Initial;
  private cached = false;
  private counters: Record<string, number> = {};

  public constructor(
    public readonly project: Project,
    private runnerFactory: SceneRunner,
    config: LayerConfig = {},
  ) {
    super({
      name: runnerFactory.name,
      width: project.width(),
      height: project.height(),
      ...config,
    });
    decorate(runnerFactory, threadable());

    this.meta = Meta.getMetaFor(`${this.name()}.scene`);
    this.timeEvents = new TimeEvents(this);
  }

  public markAsCached() {
    this.cached = true;
    this.timeEvents.onCache();
  }

  public isMarkedAsCached() {
    return this.cached;
  }

  public reload(runnerFactory?: SceneRunner) {
    if (runnerFactory) {
      this.runnerFactory = runnerFactory;
    }
    this.cached = false;
    this.timeEvents.onReload();
  }

  public async reset(previousScene: Scene = null) {
    this.x(0).y(0).opacity(1).show();
    this.counters = {};
    this.destroyChildren();
    this.previousScene = previousScene;
    this.runner = threads(
      () => this.runnerFactory(this, this.project),
      (...args) => this.threadsCallback?.(...args),
    );
    this.state = SceneState.Initial;
    await this.next();
  }

  public async next() {
    setScene(this);
    let result = this.runner.next();
    this.updateLayout();
    while (result.value) {
      if (isPromise(result.value)) {
        const value = await result.value;
        result = this.runner.next(value);
      } else {
        console.warn('Invalid value: ', result.value);
        result = this.runner.next();
      }
      this.updateLayout();
    }

    if (result.done) {
      this.state = SceneState.Finished;
    }
  }

  public updateLayout(): boolean {
    super.updateLayout();
    const result = this.wasDirty();
    let limit = 10;
    while (this.wasDirty() && limit > 0) {
      super.updateLayout();
      limit--;
    }

    if (limit === 0) {
      console.warn('Layout iteration limit exceeded');
    }

    return result;
  }

  @threadable()
  public *transition(transitionRunner?: SceneTransition) {
    if (transitionRunner) {
      yield* transitionRunner(this, this.previousScene);
    } else {
      this.previousScene?.hide();
    }
    if (this.state === SceneState.Initial) {
      this.state = SceneState.AfterTransitionIn;
    } else {
      console.warn(
        `Scene ${this.name} transitioned in an unexpected state: `,
        this.state,
      );
    }
  }

  public canFinish() {
    if (this.state === SceneState.AfterTransitionIn) {
      this.state = SceneState.CanTransitionOut;
    } else {
      console.warn(
        `Scene ${this.name} was marked as finished in an unexpected state: `,
        this.state,
      );
    }
  }

  public isAfterTransitionIn(): boolean {
    return this.state === SceneState.AfterTransitionIn;
  }

  public isFinished(): boolean {
    return this.state === SceneState.Finished;
  }

  public canTransitionOut(): boolean {
    return (
      this.state === SceneState.CanTransitionOut ||
      this.state === SceneState.Finished
    );
  }

  public add(...children: (Shape | Group)[]): this {
    super.add(...children.flat());
    this.updateLayout();
    return this;
  }

  public generateNodeId(type: string): string {
    let id = 0;
    if (type in this.counters) {
      id = ++this.counters[type];
    } else {
      this.counters[type] = id;
    }

    return `${this.name()}.${type}.${id}`;
  }
}
