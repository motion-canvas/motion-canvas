import {Stage, StageConfig} from 'konva/lib/Stage';
import {Rect} from 'konva/lib/shapes/Rect';
import {Layer} from 'konva/lib/Layer';
import {Vector2d} from 'konva/lib/types';
import {Konva} from 'konva/lib/Global';
import {
  move,
  showTop,
  surfaceTransition,
  showSurface,
  tween,
  waitFor,
  waitUntil,
  sequence,
  threads,
  ThreadsJoin,
  ThreadsCancel,
  showCircle,
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

  public constructor(
    private runnerFactory: (project: Project) => Generator,
    size: ProjectSize = ProjectSize.FullHD,
    config: Partial<StageConfig> = {},
  ) {
    //@ts-ignore
    super({
      width: Sizes[size][0],
      height: Sizes[size][1],
      listening: false,
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

    const backgroundLayer = new Layer({name: 'background'});
    backgroundLayer.add(this.background);
    this.add(backgroundLayer);
  }

  public start() {
    this.getLayers().forEach(
      layer => layer.hasName('background') || layer.destroy(),
    );
    this.frame = 0;
    this.runner = this.threads((join, cancel) => {
      this.join = join;
      this.cancel = cancel;
      return this.runnerFactory(this);
    });
  }

  public async next(speed: number = 1): Promise<boolean> {
    let result = this.runner.next();
    while (typeof result.value?.then === 'function') {
      const value = await result.value;
      result = this.runner.next(value);
    }
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
  public showCircle = showCircle;
  public surfaceTransition = surfaceTransition;
  public showSurface = showSurface;
  public sequence = sequence;
}
