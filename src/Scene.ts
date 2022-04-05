import type {Project} from './Project';
import {Layer, LayerConfig} from 'konva/lib/Layer';
import {threads, ThreadsCallback} from './animations';
import {Debug} from './components';
import {Node} from 'konva/lib/Node';
import {Group} from 'konva/lib/Group';
import {Shape} from 'konva/lib/Shape';
import {threadable} from './decorators';
import {PROJECT} from './symbols';

export interface SceneRunner {
  (layer: Scene, project: Project): Generator;
}

export interface SceneTransition {
  (next: Scene, previous?: Scene): Generator;
}

export enum SceneState {
  Initial,
  AfterTransitionIn,
  CanTransitionOut,
  Finished,
}

export class Scene extends Layer {
  public firstFrame: number = null;
  public transitionFrame: number = null;
  public lastFrame: number = null;
  public threadsCallback: ThreadsCallback = null;

  private readonly debugNode: Debug;
  private previousScene: Scene = null;
  private runner: Generator;
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
  }

  public reload(runnerFactory: SceneRunner) {
    this.runnerFactory = runnerFactory;
    this.transitionFrame = null;
    this.lastFrame = null;
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
      if (typeof result.value.then === 'function') {
        const value = await result.value;
        result = this.runner.next(value);
      } else if (result.value === PROJECT) {
        result = this.runner.next(this.project);
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
    return this.state === SceneState.CanTransitionOut;
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
}
