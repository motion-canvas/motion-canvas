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
import {setScene} from './utils';

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
  initialTime: number;
  targetTime: number;
  offset: number;
}

export class Scene extends Layer {
  public threadsCallback: ThreadsCallback = null;
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
  private cached = false;
  private preserveEvents = false;

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
      for (const event of Object.values<TimeEvent>(JSON.parse(storedEvents))) {
        this.storedEventLookup[event.name] = event;
      }
    }
  }

  public markAsCached() {
    this.cached = true;
    this.preserveEvents = false;
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.storedEventLookup),
    );
  }

  public isMarkedAsCached() {
    return this.cached;
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
    setScene(this);
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
    super.add(...children.flat());
    this.debugNode.moveToTop();
    return this;
  }

  public debug(node: Node) {
    this.debugNode.target(node);
    this.debugNode.visible(node !== null);
  }

  public getFrameEvent(name: string): number {
    const initialTime = this.project.framesToSeconds(
      this.project.frame - this.firstFrame,
    );
    if (this.timeEventLookup[name] === undefined) {
      const event: TimeEvent = {
        name,
        initialTime,
        targetTime: this.storedEventLookup[name]?.targetTime ?? initialTime,
        offset: this.storedEventLookup[name]?.offset ?? 0,
      };

      if (this.storedEventLookup[name]) {
        if (this.preserveEvents) {
          event.targetTime = event.initialTime + event.offset;
        } else {
          event.offset = Math.max(0, event.targetTime - event.initialTime);
        }
      }

      this.timeEventLookup[name] = event;
      this.timeEventsChanged.dispatch(this.timeEvents);
    } else if (this.timeEventLookup[name].initialTime !== initialTime) {
      const event: TimeEvent = {
        ...this.timeEventLookup[name],
        initialTime,
      };

      if (this.preserveEvents) {
        event.targetTime = event.initialTime + event.offset;
      } else {
        event.offset = Math.max(0, event.targetTime - event.initialTime);
      }

      this.timeEventLookup[name] = event;
      this.storedEventLookup[name] = event;
      this.timeEventsChanged.dispatch(this.timeEvents);
    }

    return (
      this.firstFrame +
      this.project.secondsToFrames(
        this.timeEventLookup[name].initialTime +
          this.timeEventLookup[name].offset,
      )
    );
  }

  public setFrameEvent(name: string, offset: number, preserve = true) {
    if (
      !this.timeEventLookup[name] ||
      this.timeEventLookup[name].offset === offset
    ) {
      return;
    }
    this.cached = false;
    this.preserveEvents = preserve;
    this.storedEventLookup[name] = this.timeEventLookup[name] = {
      ...this.timeEventLookup[name],
      targetTime: this.timeEventLookup[name].initialTime + offset,
      offset,
    };
    this.timeEventsChanged.dispatch(this.timeEvents);
  }
}
