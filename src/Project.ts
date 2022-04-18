import './patches';

import {Stage, StageConfig} from 'konva/lib/Stage';
import {Rect} from 'konva/lib/shapes/Rect';
import {Layer} from 'konva/lib/Layer';
import {Vector2d} from 'konva/lib/types';
import {Konva} from 'konva/lib/Global';
import {Thread, ThreadsCallback} from './threading';
import {Scene, SceneRunner} from './Scene';
import {SimpleEventDispatcher} from 'strongly-typed-events';
import {PlayerState} from './player/Player';

Konva.autoDrawEnabled = false;

export enum ProjectSize {
  FullHD,
}

const Sizes: Record<ProjectSize, [number, number]> = {
  [ProjectSize.FullHD]: [1920, 1080],
};

export class Project extends Stage {
  public get ScenesChanged() {
    return this.scenesChanged.asEvent();
  }

  public readonly background: Rect;
  public readonly foreground: Layer;
  public readonly center: Vector2d;
  public threadsCallback: ThreadsCallback;
  public framesPerSeconds = 30;
  public frame: number = 0;

  public get time(): number {
    return this.framesToSeconds(this.frame);
  }

  public get scenes(): Scene[] {
    return Object.values(this.sceneLookup);
  }

  public get thread(): Thread {
    return this.currentThread;
  }

  private readonly scenesChanged = new SimpleEventDispatcher<Scene[]>();
  private readonly sceneLookup: Record<string, Scene> = {};
  private previousScene: Scene = null;
  private currentScene: Scene = null;
  private currentThread: Thread = null;

  public constructor(
    scenes: SceneRunner[],
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

    this.foreground = new Layer({name: 'foreground'});
    this.add(this.foreground);

    for (const scene of scenes) {
      if (
        scene.name === undefined ||
        scene.name === '__WEBPACK_DEFAULT_EXPORT__'
      ) {
        console.warn('Runner without a name: ', scene);
      }
      const handle = new Scene(this, scene);
      this.sceneLookup[scene.name] = handle;
      handle.threadsCallback = thread => {
        if (this.currentScene === handle) {
          this.currentThread = thread;
          this.threadsCallback?.(thread);
        }
      };
    }
  }

  draw(): this {
    this.previousScene?.drawScene();
    this.currentScene?.drawScene();

    return this;
  }

  public reload(runners: SceneRunner[]) {
    for (const runner of runners) {
      this.sceneLookup[runner.name]?.reload(runner);
    }
    this.scenesChanged.dispatch(this.scenes);
  }

  public async next(speed: number = 1): Promise<boolean> {
    if (this.previousScene) {
      await this.previousScene.next();
      if (!this.currentScene || this.currentScene.isAfterTransitionIn()) {
        this.previousScene.remove();
        this.previousScene.lastFrame = this.frame;
        this.scenesChanged.dispatch(this.scenes);
        this.previousScene = null;
      }
    }

    this.frame += speed;

    if (this.currentScene) {
      await this.currentScene.next();
      if (this.currentScene.canTransitionOut()) {
        this.previousScene = this.currentScene;
        this.currentScene = this.getNextScene(this.previousScene);
        if (this.currentScene) {
          await this.currentScene.reset(this.previousScene);
          this.currentScene.firstFrame = this.frame;
          this.scenesChanged.dispatch(this.scenes);
          this.add(this.currentScene);
          this.foreground.moveToTop();
        } else {
          this.previousScene.lastFrame = this.frame;
        }
      }
    }

    return !this.currentScene || this.currentScene.isFinished();
  }

  public async recalculate() {
    this.previousScene?.remove();
    this.previousScene = null;
    this.currentScene?.remove();
    this.currentScene = this.findBestScene(Infinity);

    this.frame = this.currentScene.firstFrame ?? 0;
    this.add(this.currentScene);
    this.foreground.moveToTop();
    await this.currentScene.reset();

    let finished = false;
    while (!finished) {
      finished = await this.next(1);
    }
  }

  public async seek(frame: number, speed: number = 1): Promise<boolean> {
    if (
      frame <= this.frame ||
      !this.currentScene ||
      (this.currentScene.lastFrame !== null &&
        this.currentScene.lastFrame <= frame)
    ) {
      const scene = this.findBestScene(frame);
      if (scene !== this.currentScene) {
        this.previousScene?.remove();
        this.previousScene = null;
        this.currentScene?.remove();
        this.currentScene = scene;

        this.frame = this.currentScene.firstFrame ?? 0;
        this.add(this.currentScene);
        this.foreground.moveToTop();
        await this.currentScene.reset();
      } else if (this.frame >= frame) {
        this.previousScene?.remove();
        this.previousScene = null;
        this.frame = this.currentScene.firstFrame ?? 0;
        await this.currentScene.reset();
      }
    }

    let finished = false;
    while (this.frame < frame && !finished) {
      finished = await this.next(speed);
    }

    return finished;
  }

  private findBestScene(frame: number): Scene {
    let lastScene = null;
    for (const scene of Object.values(this.sceneLookup)) {
      if (scene.lastFrame === null || scene.lastFrame > frame) {
        return scene;
      }
      lastScene = scene;
    }

    return lastScene;
  }

  public secondsToFrames(seconds: number) {
    return Math.ceil(seconds * this.framesPerSeconds);
  }

  public framesToSeconds(frames: number) {
    return frames / this.framesPerSeconds;
  }

  private getNextScene(scene?: Scene): Scene {
    const scenes = Object.values(this.sceneLookup);
    if (!scene) {
      return scenes[0];
    }

    const index = scenes.findIndex(s => s === scene);
    if (index < 0) {
      return null;
    }
    return scenes[index + 1] ?? null;
  }
}
