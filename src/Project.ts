import {Stage, StageConfig} from 'konva/lib/Stage';
import {Rect} from 'konva/lib/shapes/Rect';
import {Layer} from 'konva/lib/Layer';
import {Scene, SceneRunner} from './Scene';
import {Vector2d} from 'konva/lib/types';
import {Konva} from 'konva/lib/Global';
import {
  move,
  showTop,
  surfaceTransition,
  tween,
  waitFor,
  waitUntil,
  sequence,
  threads,
  ThreadsJoin,
  ThreadsCancel,
} from './animations';

Konva.autoDrawEnabled = false;

export enum ProjectSize {
  FullHD,
}

const Sizes: Record<ProjectSize, [number, number]> = {
  [ProjectSize.FullHD]: [1920, 1080],
};

export class Project extends Stage {
  public readonly background: Rect;
  public readonly center: Vector2d;
  public framesPerSeconds = 60;
  public frame: number = 0;
  public get time(): number {
    return this.framesToSeconds(this.frame);
  }

  private runner: Generator;
  private scenes: Scene[] = [];

  public constructor(
    private runnerFactory: (project: Project) => Generator,
    size: ProjectSize = ProjectSize.FullHD,
    config: Partial<StageConfig> = {},
  ) {
    //@ts-ignore
    super({
      width: Sizes[size][0],
      height: Sizes[size][1],
      ...config,
    });

    this.center = {
      x: Sizes[size][0] / 2,
      y: Sizes[size][1] / 2,
    };

    this.background = new Rect({
      x: 0,
      y: 0,
      width: this.width(),
      height: this.height(),
      fill: '#141414',
    });

    const backgroundLayer = new Layer();
    backgroundLayer.add(this.background);
    this.add(backgroundLayer);
  }

  public createScene(runner: SceneRunner) {
    const scene = new Scene(this, new Layer(), runner);
    this.add(scene.layer);
    this.scenes.push(scene);

    return scene;
  }

  public start() {
    this.scenes.forEach(scene => scene.layer.destroy());
    this.scenes = [];
    this.frame = 0;
    this.runner = this.threads((join, cancel) => {
      this.join = join;
      this.cancel = cancel;
      return this.runnerFactory(this);
    });
  }

  public next(speed: number = 1): boolean {
    const result = this.runner.next();
    this.frame += speed;

    return result.done;
  }

  public secondsToFrames(seconds: number) {
    return Math.ceil(seconds * this.framesPerSeconds);
  }

  public framesToSeconds(frames: number) {
    return frames / this.framesPerSeconds;
  }

  public join: ThreadsJoin;
  public cancel: ThreadsCancel;
  public threads = threads;
  public waitFor = waitFor;
  public waitUntil = waitUntil;
  public tween = tween;
  public moveNode = move;
  public showTop = showTop;
  public surfaceTransition = surfaceTransition;
  public sequence = sequence;
}
