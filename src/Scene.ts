import {Layer, LayerConfig} from 'konva/lib/Layer';
import {Project} from './Project';
import {GeneratorHelper} from './helpers';
import {cancel} from './animations';
import {Debug} from './components';
import {Node} from 'konva/lib/Node';
import {Group} from 'konva/lib/Group';
import {Shape} from 'konva/lib/Shape';

export interface SceneRunner {
  (layer: Scene, project: Project): Generator;
}

export enum SceneState {
  Pending,
  Started,
  Finished,
  Disposed,
}

export class Scene extends Layer {
  private state: SceneState = SceneState.Pending;
  private task: Generator;
  private readonly debugNode: Debug;

  public constructor(
    public readonly project: Project,
    private readonly runner: SceneRunner,
    config?: LayerConfig,
  ) {
    super(config);
    this.debugNode = new Debug();
    this.add(this.debugNode);
    this.debugNode.hide();
  }

  public run(): Generator {
    this.project.addScene(this);
    const scene = this;
    this.task = (function* () {
      yield* scene.runner(scene, scene.project);
      if (scene.state !== SceneState.Disposed) {
        scene.state = SceneState.Finished;
      }
      while (scene.state !== SceneState.Disposed) {
        yield;
      }
    })();
    GeneratorHelper.makeThreadable(this.task, `${this.name()} [scene]`);

    return this.task;
  }

  public activate() {
    if (this.state === SceneState.Pending) {
      this.state = SceneState.Started;
    }
  }

  public *start(): Generator {
    while (this.state === SceneState.Pending) {
      yield;
    }
  }

  public *end(): Generator {
    while (this.state !== SceneState.Finished) {
      yield;
    }
  }

  public deactivate() {
    if (this.state === SceneState.Started) {
      this.state = SceneState.Finished;
    }
  }

  public *dispose() {
    this.state = SceneState.Disposed;
    yield* cancel(this.task);
    this.project.removeScene(this);
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
