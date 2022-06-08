import './patches';

import {Stage, StageConfig} from 'konva/lib/Stage';
import {Rect} from 'konva/lib/shapes/Rect';
import {Layer} from 'konva/lib/Layer';
import {Vector2d} from 'konva/lib/types';
import {Konva} from 'konva/lib/Global';
import {Thread, ThreadsCallback} from './threading';
import {Scene, SceneRunner} from './Scene';
import {SimpleEventDispatcher} from 'strongly-typed-events';
import {KonvaNode} from './decorators';

Konva.autoDrawEnabled = false;

export const ProjectSize = {
  FullHD: {width: 1920, height: 1080},
};

interface ProjectConfig extends Partial<StageConfig> {
  scenes: SceneRunner[];
  background: string | false;
}

@KonvaNode()
export class Project extends Stage {
  public get ScenesChanged() {
    return this.scenesChanged.asEvent();
  }

  public readonly background: Rect;
  public readonly master: Layer;
  public readonly center: Vector2d;
  public threadsCallback: ThreadsCallback;
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

  public get framerate(): number {
    return this.framesPerSeconds;
  }

  public set framerate(value: number) {
    this.framesPerSeconds = value;
    this.reloadAll();
  }

  public set resolutionScale(value: number) {
    this.master.canvas.setPixelRatio(value);
  }

  private framesPerSeconds = 30;
  private readonly scenesChanged = new SimpleEventDispatcher<Scene[]>();
  private readonly sceneLookup: Record<string, Scene> = {};
  private previousScene: Scene = null;
  private currentScene: Scene = null;
  private currentThread: Thread = null;

  public constructor(config: ProjectConfig) {
    const {scenes, ...rest} = config;
    super({
      listening: false,
      container: document.createElement('div'),
      ...ProjectSize.FullHD,
      ...rest,
    });

    this.offset({
      x: this.width() / -2,
      y: this.height() / -2,
    });

    this.center = {
      x: this.width() / 2,
      y: this.height() / 2,
    };

    this.background = new Rect({
      x: 0,
      y: 0,
      width: this.width(),
      height: this.height(),
      fill: config.background || '#ff00ff',
      visible: config.background !== false,
    });

    this.master = new Layer({name: 'master'});
    this.master.add(this.background);
    this.add(this.master);

    for (const scene of scenes) {
      if (
        scene.name === undefined ||
        scene.name === '__WEBPACK_DEFAULT_EXPORT__'
      ) {
        console.warn('Runner without a name: ', scene);
      }
      const handle = new Scene(this, scene);
      if (this.sceneLookup[scene.name]) {
        console.warn('Duplicated scene name: ', scene.name);
        handle.name(scene.name + Math.random());
      }
      this.sceneLookup[handle.name()] = handle;
      handle.threadsCallback = thread => {
        if (this.currentScene === handle) {
          this.currentThread = thread;
          this.threadsCallback?.(thread);
        }
      };
    }
  }

  public draw(): this {
    this.master.drawScene();
    return this;
  }

  public reload(runners: SceneRunner[]) {
    for (const runner of runners) {
      this.sceneLookup[runner.name]?.reload(runner);
    }
  }

  public reloadAll() {
    for (const scene of Object.values(this.sceneLookup)) {
      scene.reload();
    }
  }

  public async next(speed: number = 1): Promise<boolean> {
    if (this.previousScene) {
      await this.previousScene.next();
      if (!this.currentScene || this.currentScene.isAfterTransitionIn()) {
        this.previousScene.remove();
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
          this.master.add(this.currentScene);
        }
      }
    }

    return !this.currentScene || this.currentScene.isFinished();
  }

  public async recalculate() {
    const initialScene = this.currentScene;
    this.previousScene?.remove();
    this.previousScene = null;
    this.currentScene = null;

    this.frame = 0;
    let offset = 0;
    for (const scene of this.scenes) {
      if (scene.isMarkedAsCached()) {
        scene.firstFrame += offset;
        this.frame = scene.lastFrame;
      } else {
        this.currentScene = scene;
        scene.firstFrame = this.frame;
        scene.transitionDuration = -1;
        await scene.reset();
        while (!scene.canTransitionOut()) {
          if (scene.transitionDuration < 0 && scene.isAfterTransitionIn()) {
            scene.transitionDuration = this.frame - scene.firstFrame;
          }
          this.frame++;
          await scene.next();
        }
        offset += this.frame - scene.lastFrame;
        scene.lastFrame = this.frame;
        scene.markAsCached();

        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    this.currentScene = initialScene;
    this.scenesChanged.dispatch(this.scenes);
  }

  public async seek(frame: number, speed: number = 1): Promise<boolean> {
    if (
      frame <= this.frame ||
      !this.currentScene ||
      (this.currentScene.isMarkedAsCached() &&
        this.currentScene.lastFrame < frame)
    ) {
      const scene = this.findBestScene(frame);
      if (scene !== this.currentScene) {
        this.previousScene?.remove();
        this.previousScene = null;
        this.currentScene?.remove();
        this.currentScene = scene;

        this.frame = this.currentScene.firstFrame;
        this.master.add(this.currentScene);
        await this.currentScene.reset();
      } else if (this.frame >= frame) {
        this.previousScene?.remove();
        this.previousScene = null;
        this.frame = this.currentScene.firstFrame;
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
      if (!scene.isMarkedAsCached() || scene.lastFrame > frame) {
        return scene;
      }
      lastScene = scene;
    }

    return lastScene;
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

  public secondsToFrames(seconds: number) {
    return Math.ceil(seconds * this.framesPerSeconds);
  }

  public framesToSeconds(frames: number) {
    return frames / this.framesPerSeconds;
  }

  public async getBlob(): Promise<Blob> {
    return new Promise<Blob>(resolve =>
      this.master.getNativeCanvasElement().toBlob(resolve, 'image/png'),
    );
  }
}
