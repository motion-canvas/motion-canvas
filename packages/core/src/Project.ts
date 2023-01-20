import {FullSceneDescription, Scene} from './scenes';
import {Meta, Metadata} from './Meta';
import {EventDispatcher, ValueDispatcher} from './events';
import {CanvasColorSpace, CanvasOutputMimeType, Vector2} from './types';
import {AudioManager} from './media';
import {getContext} from './utils';
import {Logger} from './Logger';
import {createSignal} from './signals';

const EXPORT_FRAME_LIMIT = 256;
const EXPORT_RETRY_DELAY = 1000;

export const ProjectSize: Record<string, Vector2> = {
  FullHD: new Vector2(1920, 1080),
};

export interface ProjectConfig {
  name?: string;
  scenes: FullSceneDescription[];
  audio?: string;
  audioOffset?: number;
  canvas?: HTMLCanvasElement;
  size?: Vector2;
  background?: string | false;
}

export enum PlaybackState {
  Playing,
  Rendering,
  Paused,
  Seeking,
}

export type ProjectMetadata = Metadata;

export function makeProject(config: ProjectConfig) {
  return config;
}

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
  private readonly currentScene = new ValueDispatcher<Scene | null>(null);

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

  public set fileType(value: CanvasOutputMimeType) {
    this._fileType = value;
  }

  public set quality(value: number) {
    this._quality = value;
  }

  public set speed(value: number) {
    this._speed = value;
    this.reloadAll();
  }

  private updateCanvas() {
    if (!this.canvas) {
      return;
    }

    this.bufferContext = this.buffer.getContext('2d', {
      colorSpace: this._colorSpace,
    });
    this.previousBufferContext = this.previousBuffer.getContext('2d', {
      colorSpace: this._colorSpace,
    });
    this.context = this.canvas.getContext('2d', {
      colorSpace: this._colorSpace,
    });

    this.canvas.width =
      this.buffer.width =
      this.previousBuffer.width =
        this.width * this._resolutionScale;
    this.canvas.height =
      this.buffer.height =
      this.previousBuffer.height =
        this.height * this._resolutionScale;

    this.render();
  }

  public setCanvas(value: HTMLCanvasElement | null = null) {
    this.canvas = value;
    this.updateCanvas();
  }

  public setSize(size: Vector2): void;
  public setSize(width: number, height: number): void;
  public setSize(value: Vector2 | number, height?: number): void {
    if (typeof value === 'object') {
      this.width = value.width;
      this.height = value.height;
    } else {
      this.width = value;
      this.height = height!;
    }
    this.updateCanvas();
    this.reloadAll();
  }

  public getSize(): Vector2 {
    return new Vector2(this.width, this.height);
  }

  public readonly name: string;
  public readonly audio = new AudioManager();
  public readonly logger = new Logger();
  public readonly background: string | false;
  public readonly creationStack: string;
  public playbackState = createSignal(PlaybackState.Paused);
  private readonly renderLookup: Record<number, Callback> = {};
  private _resolutionScale = 1;
  private _colorSpace: CanvasColorSpace = 'srgb';
  private _fileType: CanvasOutputMimeType = 'image/png';
  private _quality = 1;
  private _speed = 1;
  private framesPerSeconds = 30;
  private previousScene: Scene | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private buffer = document.createElement('canvas');
  private bufferContext: CanvasRenderingContext2D | null = null;
  private previousBuffer = document.createElement('canvas');
  private previousBufferContext: CanvasRenderingContext2D | null = null;
  private exportCounter = 0;

  private width = 0;
  private height = 0;

  /**
   * @deprecated Use {@link makeProject} instead.
   *
   * @param config - The project configuration.
   */
  public constructor(config: ProjectConfig);
  public constructor(
    name: string,
    meta: Meta<ProjectMetadata>,
    config: ProjectConfig,
  );
  public constructor(
    name: string | ProjectConfig,
    meta?: Meta<ProjectMetadata>,
    config?: ProjectConfig,
  ) {
    const {
      scenes,
      audio,
      audioOffset,
      canvas,
      size = ProjectSize.FullHD,
      background = false,
    } = typeof name === 'string' ? config! : name;

    this.name = typeof name === 'string' ? name : '';
    this.meta = meta!;

    this.creationStack = new Error().stack ?? '';
    this.setCanvas(canvas);
    this.setSize(size);
    this.background = background;

    if (audio) {
      this.audio.setSource(audio);
    }
    if (audioOffset) {
      this.audio.setOffset(audioOffset);
    }

    const instances: Scene[] = [];
    for (const description of scenes) {
      const scene = new description.klass({
        ...description,
        project: this,
      });
      description.onReplaced?.subscribe(description => {
        scene.creationStack = description.stack;
        scene.reload(description.config);
      }, false);
      scene.onReloaded.subscribe(() => this.reloaded.dispatch());
      instances.push(scene);
    }
    this.scenes.current = instances;

    if (import.meta.hot) {
      import.meta.hot.on('motion-canvas:export-ack', ({frame}) => {
        this.renderLookup[frame]?.();
      });
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

  public async render() {
    if (!this.canvas || !this.context) return;

    if (this.previousScene) {
      this.previousBufferContext ??= getContext(this.previousBuffer);
      this.transformCanvas(this.previousBufferContext);
      await this.previousScene.render(this.previousBufferContext);
    }

    this.bufferContext ??= getContext(this.buffer);
    this.transformCanvas(this.bufferContext);
    await this.currentScene.current?.render(this.bufferContext);

    if (this.background) {
      this.context.save();
      this.context.fillStyle = this.background;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();
    } else {
      this.context.clearRect(0, 0, this.width, this.height);
    }

    if (this.previousScene) {
      this.context.drawImage(this.previousBuffer, 0, 0);
    }

    this.context.drawImage(this.buffer, 0, 0);
  }

  private reloadAll() {
    for (const scene of this.scenes.current) {
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
        if (
          !this.currentScene.current ||
          this.currentScene.current.isAfterTransitionIn()
        ) {
          this.previousScene = null;
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
    const scenes = [...this.scenes.current];
    for (const scene of scenes) {
      await scene.recalculate();
    }
    this._speed = speed;
    this.scenes.current = scenes;
  }

  public async seek(frame: number): Promise<boolean> {
    if (this.currentScene.current && !this.currentScene.current.isCached()) {
      this.logger.warn(
        `Attempting to seek a project with an invalidated scene: ${this.currentScene.current.name}`,
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

  public async export(isStill = false) {
    const frame = this.frame;

    if (this.renderLookup[frame]) {
      this.logger.warn(`Frame no. ${frame} is already being exported.`);
      return;
    }
    if (import.meta.hot) {
      while (this.exportCounter > EXPORT_FRAME_LIMIT) {
        await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
      }
      if (!this.canvas) {
        return;
      }

      this.exportCounter++;
      this.renderLookup[frame] = () => {
        this.exportCounter--;
        delete this.renderLookup[frame];
      };
      import.meta.hot!.send('motion-canvas:export', {
        frame,
        isStill,
        data: this.canvas.toDataURL(this._fileType, this._quality),
        mimeType: this._fileType,
        project: this.name,
      });
    }
  }

  public async finishExport() {
    while (this.exportCounter > 0) {
      await new Promise(resolve => setTimeout(resolve, EXPORT_RETRY_DELAY));
    }
  }

  public syncAudio(frameOffset = 0) {
    this.audio.setTime(this.framesToSeconds(this.frame + frameOffset));
  }

  private findBestScene(frame: number): Scene {
    let lastScene = this.scenes.current[0];
    for (const scene of this.scenes.current) {
      if (!scene.isCached()) {
        this.logger.warn(
          `Attempting to seek a project with an invalidated scene: ${scene.name}`,
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

  private getNextScene(scene?: Scene): Scene | null {
    const scenes = this.scenes.current;
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
