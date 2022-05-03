import type {Project} from './Project';
import {Layer, LayerConfig} from 'konva/lib/Layer';
import {
  isPromise,
  ThreadGenerator,
  threads,
  ThreadsCallback,
} from './threading';
import {Debug} from './components';
import {Node} from 'konva/lib/Node';
import {Group} from 'konva/lib/Group';
import {Shape} from 'konva/lib/Shape';
import {SceneTransition} from './transitions';
import {decorate, threadable} from './decorators';
import {PROJECT, SCENE} from './symbols';
import {SimpleEventDispatcher} from 'strongly-typed-events';

export interface SceneRunner {
  (layer: Scene, project: Project): ThreadGenerator;
}

export enum SceneState {
  Initial,
  AfterTransitionIn,
  CanTransitionOut,
  Finished,
}

export interface TimeEvent {
  name: string;
  initialFrame: number;
  offset: number;
  fps: number;
}

export class Scene extends Layer {
  public threadsCallback: ThreadsCallback = null;
  public cached = false;
  public firstFrame: number = 0;
  public transitionDuration: number = 0;
  public duration: number = 0;

  public get lastFrame() {
    return this.firstFrame + this.duration;
  }
  public set lastFrame(value: number) {
    this.duration = value - this.firstFrame;
  }

  public get timeEvents(): TimeEvent[] {
    return Object.values(this.timeEventLookup);
  }

  public get TimeEventsChanged() {
    return this.timeEventsChanged.asEvent();
  }

  private readonly debugNode: Debug;
  private readonly storageKey: string;
  private readonly timeEventsChanged = new SimpleEventDispatcher<TimeEvent[]>();
  private timeEventLookup: Record<string, TimeEvent> = {};
  private storedEventLookup: Record<string, TimeEvent> = {};
  private previousScene: Scene = null;
  private runner: ThreadGenerator;
  private state: SceneState = SceneState.Initial;

  public constructor(
    public readonly project: Project,
    private runnerFactory: SceneRunner,
    config: LayerConfig = {},
  ) {
    super({
      name: runnerFactory.name,
      ...config,
    });
    this.debugNode = new Debug();
    this.add(this.debugNode);
    this.debugNode.hide();
    decorate(runnerFactory, threadable());

    this.storageKey = `scene-${this.name()}`;
    const storedEvents = localStorage.getItem(this.storageKey);
    if (storedEvents) {
      const fps = project.framesPerSeconds;
      for (const event of Object.values<TimeEvent>(JSON.parse(storedEvents))) {
        const oldFps = event.fps ?? 30;
        if (oldFps !== fps) {
          event.initialFrame = (event.offset * fps) / oldFps;
          event.offset = (event.offset * fps) / oldFps;
        }
        event.fps = fps;
        this.storedEventLookup[event.name] = event;
      }
    }
  }

  public reload(runnerFactory?: SceneRunner) {
    if (runnerFactory) {
      this.runnerFactory = runnerFactory;
    }
    this.debug(null);
    this.cached = false;
    this.storedEventLookup = {
      ...this.storedEventLookup,
      ...this.timeEventLookup,
    };
    this.timeEventLookup = {};
    this.timeEventsChanged.dispatch([]);
  }

  public async reset(previousScene: Scene = null) {
    this.x(0).y(0);
    this.debugNode.remove();
    this.destroyChildren();
    this.add(this.debugNode);
    this.previousScene = previousScene;
    this.runner = threads(
      () => this.runnerFactory(this, this.project),
      (...args) => this.threadsCallback?.(...args),
    );
    this.state = SceneState.Initial;
    await this.next();
  }

  public async next() {
    let result = this.runner.next();
    while (result.value) {
      if (isPromise(result.value)) {
        const value = await result.value;
        result = this.runner.next(value);
      } else if (result.value === PROJECT) {
        result = this.runner.next(this.project);
      } else if (result.value === SCENE) {
        result = this.runner.next(this);
      } else {
        console.log('Invalid value: ', result.value);
        result = this.runner.next();
      }
    }

    if (result.done) {
      this.state = SceneState.Finished;
    }
  }

  @threadable()
  public *transition(transitionRunner?: SceneTransition) {
    if (transitionRunner) {
      yield* transitionRunner(this, this.previousScene);
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
    super.add(...children);
    this.debugNode.moveToTop();
    return this;
  }

  public debug(node: Node) {
    this.debugNode.target(node);
    this.debugNode.visible(node !== null);
  }

  public getFrameEvent(name: string): number {
    const initialFrame = this.project.frame - this.firstFrame;
    if (this.timeEventLookup[name] === undefined) {
      this.timeEventLookup[name] = {
        name,
        initialFrame,
        offset: this.storedEventLookup[name]?.offset ?? 0,
        fps: this.project.framesPerSeconds,
      };
      this.timeEventsChanged.dispatch(this.timeEvents);
    } else if (this.timeEventLookup[name].initialFrame !== initialFrame) {
      this.timeEventLookup[name] = {
        ...this.timeEventLookup[name],
        initialFrame,
      };
      this.timeEventsChanged.dispatch(this.timeEvents);
    }

    return (
      this.firstFrame +
      this.timeEventLookup[name].initialFrame +
      this.timeEventLookup[name].offset
    );
  }

  public setFrameEvent(name: string, frame: number) {
    if (
      !this.timeEventLookup[name] ||
      this.timeEventLookup[name].offset === frame
    ) {
      return;
    }
    this.cached = false;
    this.storedEventLookup[name] = this.timeEventLookup[name] = {
      ...this.timeEventLookup[name],
      offset: frame,
    };
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.storedEventLookup),
    );
    this.timeEventsChanged.dispatch(this.timeEvents);
  }
}
