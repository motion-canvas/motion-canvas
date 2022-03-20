import {Layer} from 'konva/lib/Layer';
import {Project} from './Project';

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

  public constructor(
    public readonly project: Project,
    private runner: SceneRunner,
  ) {
    super();
  }

  public *run(): Generator {
    this.project.add(this);
    yield* this.runner(this, this.project);
    this.state = SceneState.Finished;
    // @ts-ignore
    while (this.state !== SceneState.Disposed) {
      yield;
    }
  }

  public activate() {
    this.state = SceneState.Started;
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
    this.state = SceneState.Finished;
  }

  public dispose() {
    this.state = SceneState.Disposed;
    this.destroy();
  }
}
