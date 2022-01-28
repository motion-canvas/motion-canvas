import {Stage, StageConfig} from 'konva/lib/Stage';
import {Rect} from 'konva/lib/shapes/Rect';
import {Layer} from 'konva/lib/Layer';
import {Scene, SceneRunner} from './Scene';

export enum ProjectSize {
  FullHD,
}

const Sizes: Record<ProjectSize, [number, number]> = {
  [ProjectSize.FullHD]: [1920, 1080],
};

export class Project extends Stage {
  public readonly background: Rect;
  public framesPerSeconds = 60;
  public frame: number = 0;
  private runner: Generator;

  public constructor(
    size: ProjectSize = ProjectSize.FullHD,
    config: Partial<StageConfig> = {},
  ) {
    //@ts-ignore
    super({
      width: Sizes[size][0],
      height: Sizes[size][1],
      ...config,
    });

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
    const layer = new Layer();
    this.add(layer);

    return new Scene(this, layer, runner);
  }

  public setRunner(factory: (project: Project) => Generator) {
    this.frame = 0;
    this.runner = factory(this);
  }

  public next(): boolean {
    const result = this.runner.next();
    this.frame++;

    return result.done;
  }

  public *waitForTime(targetTime = 0, after?: Generator): Generator {
    while (this.frame < targetTime * this.framesPerSeconds) {
      yield;
    }

    if (after) {
      yield* after;
    }
  }

  public *waitForFrames(numberOfFrames = 0, after?: Generator): Generator {
    const startFrame = this.frame;
    while (this.frame - startFrame < numberOfFrames) {
      yield;
    }

    if (after) {
      yield* after;
    }
  }

  public *waitForSeconds(numberOfSeconds = 0, after?: Generator): Generator {
    const startFrame = this.frame;
    while (this.frame - startFrame < numberOfSeconds * this.framesPerSeconds) {
      yield;
    }

    if (after) {
      yield* after;
    }
  }
}
