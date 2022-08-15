import {Scene, SceneDescription} from './scenes';
import {Meta, Metadata} from './Meta';
import {EventDispatcher, ValueDispatcher} from './events';
import {Size, CanvasColorSpace} from './types';
import {AudioManager} from './media';
import {ifHot} from './utils';

export const ProjectSize = {
  FullHD: {width: 1920, height: 1080},
};

export interface ProjectConfig {
  name: string;
  scenes: SceneDescription[];
  audio?: string;
  audioOffset?: number;
  canvas?: HTMLCanvasElement;
  size?: Size;
  background?: string | false;
}

export type ProjectMetadata = Metadata;

export class Project {
  /**
   * Triggered after the scenes were recalculated.
   */
  public get onScenesChanged() {
    return this.scenes.subscribable;
  }
  private readonly scenes = new ValueDispatcher<Scene[]>([]);

  /**
   * Triggered when the current scene changes.
   */
  public get onCurrentSceneChanged() {
    return this.currentScene.subscribable;
  }
  private readonly currentScene = new ValueDispatcher<Scene>(null);

  /**
   * Triggered after any of the scenes were reloaded.
   */
  public get onReloaded() {
    return this.reloaded;
  }
  private readonly reloaded = new EventDispatcher<void>();

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
    this.reloadAll();
  }

  public getSize(): Size {
    return {
      width: this.width,
      height: this.height,
    };
  }

  public readonly name: string;
  public readonly audio = new AudioManager();
  private readonly renderLookup: Record<number, Callback> = {};
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

  public constructor({
    name,
    scenes,
    audio,
    audioOffset,
    canvas,
    size = ProjectSize.FullHD,
    background = false,
  }: ProjectConfig) {
    this.setCanvas(canvas);
    this.setSize(size);
    this.name = name;
    this.background = background;
    this.meta = Meta.getMetaFor(PROJECT_FILE_NAME);

    if (audio) {
      this.audio.setSource(audio);
    }
    if (audioOffset) {
      this.audio.setOffset(audioOffset);
    }

    for (const scene of scenes) {
      if (this.sceneLookup[scene.name]) {
        console.error('Duplicated scene name: ', scene.name);
        continue;
      }

      const instance = new scene.klass(this, scene.name, scene.config);
      instance.onReloaded.subscribe(() => this.reloaded.dispatch());
      this.sceneLookup[scene.name] = instance;
    }

    ifHot(hot => {
      hot.on('motion-canvas:export-ack', ({frame}) => {
        this.renderLookup[frame]?.();
      });
    });
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

  private reloadAll() {
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

  public async export() {
    const frame = this.frame;

    if (this.renderLookup[frame]) {
      console.warn(`Frame no. ${frame} is already being exported`);
      return;
    }

    await ifHot(
      hot =>
        new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            delete this.renderLookup[frame];
            reject(`Connection timeout when exporting frame no. ${frame}`);
          }, 1000);
          this.renderLookup[frame] = () => {
            delete this.renderLookup[frame];
            resolve();
          };
          hot.send('motion-canvas:export', {
            frame,
            data: this.canvas.toDataURL('image/png'),
            mimeType: 'image/png',
          });
        }),
    );
  }

  public syncAudio(frameOffset = 0) {
    this.audio.setTime(this.framesToSeconds(this.frame + frameOffset));
  }

  public updateScene(description: SceneDescription) {
    this.sceneLookup[description.name]?.reload(description.config);
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
}
