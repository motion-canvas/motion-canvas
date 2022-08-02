import {Scene, SceneDescription} from './scenes';
import {Meta, Metadata} from './Meta';
import {ValueDispatcher} from './events';
import {Size, CanvasColorSpace} from './types';

export const ProjectSize = {
  FullHD: {width: 1920, height: 1080},
};

export interface ProjectConfig {
  name: string;
  scenes: SceneDescription[];
  canvas?: HTMLCanvasElement;
  background?: string | false;
  width?: number;
  height?: number;
}

export type ProjectMetadata = Metadata;

export class Project {
  public get onScenesChanged() {
    return this.scenes.subscribable;
  }
  private readonly scenes = new ValueDispatcher<Scene[]>([]);

  public get onCurrentSceneChanged() {
    return this.currentScene.subscribable;
  }
  private readonly currentScene = new ValueDispatcher<Scene>(null);

  public readonly version = CORE_VERSION;
  public readonly meta: Meta<ProjectMetadata>;
  public frame = 0;

  public get time(): number {
    return this.framesToSeconds(this.frame);
  }

  public get framerate(): number {
    return this.framesPerSeconds / this._speed;
  }

  public set framerate(value: number) {
    this.framesPerSeconds = value;
    this.reloadAll();
  }

  public set resolutionScale(value: number) {
    this._resolutionScale = value;
    this.updateCanvas();
  }

  public set colorSpace(value: CanvasColorSpace) {
    this._colorSpace = value;
    this.updateCanvas();
  }

  public set speed(value: number) {
    this._speed = value;
    this.reloadAll();
  }

  private updateCanvas() {
    if (this.canvas) {
      this.context = this.canvas.getContext('2d', {
        colorSpace: this._colorSpace,
      });
      this.canvas.width = this.width * this._resolutionScale;
      this.canvas.height = this.height * this._resolutionScale;
      this.render();
    }
  }

  public setCanvas(value: HTMLCanvasElement) {
    this.canvas = value;
    this.updateCanvas();
  }

  public setSize(size: Size): void;
  public setSize(width: number, height: number): void;
  public setSize(value: Size | number, height?: number): void {
    if (typeof value === 'object') {
      this.width = value.width;
      this.height = value.height;
    } else {
      this.width = value;
      this.height = height;
    }
    this.updateCanvas();
  }

  public getSize(): Size {
    return {
      width: this.width,
      height: this.height,
    };
  }

  public readonly name: string;
  private _resolutionScale = 1;
  private _colorSpace: CanvasColorSpace = 'srgb';
  private _speed = 1;
  private framesPerSeconds = 30;
  private readonly sceneLookup: Record<string, Scene> = {};
  private previousScene: Scene = null;
  private background: string | false;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private width: number;
  private height: number;

  public constructor(config: ProjectConfig) {
    this.setCanvas(config.canvas ?? null);
    this.setSize(
      config.width ?? ProjectSize.FullHD.width,
      config.height ?? ProjectSize.FullHD.height,
    );
    this.name = config.name;
    this.background = config.background ?? false;
    this.meta = Meta.getMetaFor(PROJECT_FILE_NAME);

    for (const scene of config.scenes) {
      if (this.sceneLookup[scene.name]) {
        console.error('Duplicated scene name: ', scene.name);
        continue;
      }

      this.sceneLookup[scene.name] = new scene.klass(
        this,
        scene.name,
        scene.config,
      );
    }
  }

  public transformCanvas(context: CanvasRenderingContext2D) {
    context.setTransform(
      this._resolutionScale,
      0,
      0,
      this._resolutionScale,
      (this.width * this._resolutionScale) / 2,
      (this.height * this._resolutionScale) / 2,
    );
  }

  public render() {
    if (!this.canvas) return;

    this.transformCanvas(this.context);
    if (this.background) {
      this.context.save();
      this.context.fillStyle = this.background;
      this.context.fillRect(
        this.width / -2,
        this.height / -2,
        this.width,
        this.height,
      );
      this.context.restore();
    } else {
      this.context.clearRect(
        this.width / -2,
        this.height / -2,
        this.width,
        this.height,
      );
    }

    this.previousScene?.render(this.context, this.canvas);
    this.currentScene.current?.render(this.context, this.canvas);
  }

  public reload(runners: SceneDescription[]) {
    for (const runner of runners) {
      this.sceneLookup[runner.name]?.reload(runner.config);
    }
  }

  public reloadAll() {
    for (const scene of Object.values(this.sceneLookup)) {
      scene.reload();
    }
  }

  public async next(): Promise<boolean> {
    if (this.previousScene) {
      await this.previousScene.next();
      if (!this.currentScene.current) {
        this.previousScene = null;
      }
    }

    this.frame += this._speed;

    if (this.currentScene.current) {
      await this.currentScene.current.next();
      if (
        this.previousScene &&
        this.currentScene.current.isAfterTransitionIn()
      ) {
        this.previousScene = null;
      }
      if (this.currentScene.current.canTransitionOut()) {
        this.previousScene = this.currentScene.current;
        this.currentScene.current = this.getNextScene(this.previousScene);
        if (this.currentScene.current) {
          await this.currentScene.current.reset(this.previousScene);
        }
      }
    }

    return !this.currentScene.current || this.currentScene.current.isFinished();
  }

  public async recalculate() {
    this.previousScene = null;

    const speed = this._speed;
    this._speed = 1;
    this.frame = 0;
    const scenes = Object.values(this.sceneLookup);
    for (const scene of scenes) {
      await scene.recalculate();
    }
    this._speed = speed;
    this.scenes.current = scenes;
  }

  public async seek(frame: number): Promise<boolean> {
    if (this.currentScene.current && !this.currentScene.current.isCached()) {
      console.warn(
        'Attempting to seek a project with an invalidated scene:',
        this.currentScene.current.name,
      );
    }

    if (
      frame <= this.frame ||
      !this.currentScene.current ||
      (this.currentScene.current.isCached() &&
        this.currentScene.current.lastFrame < frame)
    ) {
      const scene = this.findBestScene(frame);
      if (scene !== this.currentScene.current) {
        this.previousScene = null;
        this.currentScene.current = scene;

        this.frame = this.currentScene.current.firstFrame;
        await this.currentScene.current.reset();
      } else if (this.frame >= frame) {
        this.previousScene = null;
        this.frame = this.currentScene.current.firstFrame;
        await this.currentScene.current.reset();
      }
    }

    let finished = false;
    while (this.frame < frame && !finished) {
      finished = await this.next();
    }

    return finished;
  }

  private findBestScene(frame: number): Scene {
    let lastScene = null;
    for (const scene of Object.values(this.sceneLookup)) {
      if (!scene.isCached()) {
        console.warn(
          'Attempting to seek a project with an invalidated scene:',
          scene.name,
        );
        return scene;
      }
      if (scene.lastFrame > frame) {
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
      this.canvas.toBlob(resolve, 'image/png'),
    );
  }
}
