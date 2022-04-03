import './patches';

import {Stage, StageConfig} from 'konva/lib/Stage';
import {Rect} from 'konva/lib/shapes/Rect';
import {Layer} from 'konva/lib/Layer';
import {Vector2d} from 'konva/lib/types';
import {Konva} from 'konva/lib/Global';
import {threads, ThreadsCallback} from './animations';
import {Scene} from './Scene';
import {PROJECT} from './symbols';

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
  public threadsCallback: ThreadsCallback;
  public framesPerSeconds = 60;
  public frame: number = 0;
  public get time(): number {
    return this.framesToSeconds(this.frame);
  }

  private runner: Generator;
  private readonly scenes = new Set<Scene>();

  public constructor(
    public runnerFactory: (project: Project) => Generator,
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

  public addScene(scene: Scene) {
    if (!this.scenes.has(scene)) {
      this.scenes.add(scene);
      this.add(scene);
    }
  }

  public removeScene(scene: Scene) {
    if (this.scenes.has(scene)) {
      this.scenes.delete(scene);
      scene.destroy();
    }
  }

  public start() {
    this.scenes.forEach(scene => scene.destroy());
    this.scenes.clear();
    this.frame = 0;
    this.runner = threads(
      () => this.runnerFactory(this),
      (runners, children, cancelled) =>
        this.threadsCallback?.(runners, children, cancelled),
    );
  }

  public async next(speed: number = 1): Promise<boolean> {
    let result = this.runner.next();
    while (result.value) {
      if (typeof result.value.then === 'function') {
        const value = await result.value;
        result = this.runner.next(value);
      } else if (result.value === PROJECT) {
        result = this.runner.next(this);
      } else {
        console.log('Invalid value: ', result.value);
        result = this.runner.next();
      }
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
}
