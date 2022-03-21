import {Layer, LayerConfig} from 'konva/lib/Layer';
import {Project} from './Project';
import {GeneratorHelper} from './helpers';
import {cancel} from "./animations";

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

  public constructor(
    public readonly project: Project,
    private readonly runner: SceneRunner,
    config?: LayerConfig,
  ) {
    super(config);
  }

  public run(): Generator {
    this.project.add(this);
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
    this.destroy();
  }
}
