import {Shape, ShapeConfig} from 'konva/lib/Shape';
import {Context} from 'konva/lib/Context';
import {Util} from 'konva/lib/Util';
import {GetSet} from 'konva/lib/types';
import {Factory} from 'konva/lib/Factory';
import {
  getBooleanValidator,
  getNumberValidator,
  getStringValidator,
} from 'konva/lib/Validators';
import {Project} from 'MC/Project';
import {
  ISurfaceChild,
  SURFACE_CHANGE_EVENT,
  SurfaceData,
} from 'MC/components/Surface';

interface FrameData {
  fileName: string;
  url: string;
  data: number[];
  width: number;
  height: number;
}

interface SpriteData {
  animations: Record<string, {frames: FrameData[]}>;
  skins: Record<string, FrameData>;
}

export interface SpriteConfig extends ShapeConfig {
  animationData: SpriteData;
  animation: string;
  skin?: string;
  playing?: boolean;
  fps?: number;
}

const COMPUTE_CANVAS_SIZE = 1024;

export class Sprite extends Shape implements ISurfaceChild {
  public animation: GetSet<string, this>;
  public skin: GetSet<string, this>;
  public playing: GetSet<boolean, this>;
  public fps: GetSet<number, this>;

  private readonly animationData: SpriteData;
  private frame: FrameData = {
    height: 0,
    width: 0,
    url: '',
    data: [],
    fileName: '',
  };
  private frameId: number = 0;
  private stopped: boolean = false;
  private readonly computeCanvas: HTMLCanvasElement;

  public get context(): CanvasRenderingContext2D {
    return this.computeCanvas.getContext('2d');
  }

  public get project(): Project {
    return <Project>this.getStage();
  }

  constructor(config?: SpriteConfig) {
    super(config);
    this.animationData = config.animationData;
    this.computeCanvas = Util.createCanvasElement();
    this.computeCanvas.width = COMPUTE_CANVAS_SIZE;
    this.computeCanvas.height = COMPUTE_CANVAS_SIZE;

    this.recalculate();
  }

  getSurfaceData(): SurfaceData {
    return {
      ...this.getClientRect({relativeTo: this.getLayer()}),
      color: '#58817b',
      radius: 8,
    };
  }

  _sceneFunc(context: Context) {
    context.save();
    context._context.imageSmoothingEnabled = false;
    context.drawImage(
      this.computeCanvas,
      0,
      0,
      this.frame.width,
      this.frame.height,
      0,
      0,
      this.frame.width,
      this.frame.height,
    );
    context.restore();
  }

  private recalculate() {
    const skin = this.animationData.skins[this.skin()];
    const animation = this.animationData.animations[this.animation()];
    if (!animation || animation.frames.length === 0) return;

    this.frameId %= animation.frames.length;
    this.frame = animation.frames[this.frameId];
    this.width(this.frame.width);
    this.offsetX(this.frame.width / 2);
    this.height(this.frame.height);
    this.offsetY(this.frame.height / 2);

    const frameData = this.context.createImageData(this.frame.width, this.frame.height);

    if (skin) {
      for (let y = 0; y < this.frame.height; y++) {
        for (let x = 0; x < this.frame.width; x++) {
          const id = (y * this.frame.width + x) * 4;
          const skinX = this.frame.data[id];
          const skinY = this.frame.data[id + 1];
          const skinId = ((skin.height - 1 - skinY) * skin.width + skinX) * 4;

          frameData.data[id] = skin.data[skinId];
          frameData.data[id + 1] = skin.data[skinId + 1];
          frameData.data[id + 2] = skin.data[skinId + 2];
          frameData.data[id + 3] = this.frame.data[id + 3] * skin.data[skinId + 3];
        }
      }
    } else {
      frameData.data.set(this.frame.data);
    }

    this.context.clearRect(0, 0, this.frame.width, this.frame.height);
    this.context.putImageData(frameData, 0, 0);

    this.fire(SURFACE_CHANGE_EVENT, undefined, true);
  }

  public play(): Generator {
    this.stopped = false;
    return this.playRunner();
  }

  private *playRunner() {
    while (!this.stopped) {
      if (this.playing()) {
        this.frameId++;
        this.recalculate();
      }
      yield* this.project.waitFor(1 / this.fps());
    }
  }

  public stop() {
    this.stopped = true;
  }

  public *waitForFrame(frame: number): Generator {
    let limit = 1000;
    while (this.frameId !== frame && limit > 0) {
      limit--;
      yield;
    }

    if (limit === 0) {
      console.warn(`Sprite.waitForFrame cancelled`);
    }
  }
}

Factory.addGetterSetter(Sprite, 'animation', '', getStringValidator());
Factory.addGetterSetter(Sprite, 'skin', '', getStringValidator());
Factory.addGetterSetter(Sprite, 'playing', false, getBooleanValidator());
Factory.addGetterSetter(Sprite, 'fps', 10, getNumberValidator());
