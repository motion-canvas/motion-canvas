import {Context} from 'konva/lib/Context';
import {Util} from 'konva/lib/Util';
import {GetSet, Vector2d} from 'konva/lib/types';
import {LayoutShape, LayoutShapeConfig} from './LayoutShape';
import {cancel, TimeTween, waitFor} from '../animations';
import {AnimatedGetSet, getset, KonvaNode, threadable} from '../decorators';
import {GeneratorHelper} from '../helpers';
import {ImageData} from 'canvas';

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

export interface SpriteConfig extends LayoutShapeConfig {
  animationData: SpriteData;
  animation: string;
  skin?: string;
  playing?: boolean;
  fps?: number;
  mask?: string;
  maskBlend?: number;
}

export const SPRITE_CHANGE_EVENT = 'spriteChange';

const COMPUTE_CANVAS_SIZE = 1024;

@KonvaNode()
export class Sprite extends LayoutShape {
  @getset('', Sprite.prototype.recalculate)
  public animation: GetSet<string, this>;
  @getset('', Sprite.prototype.recalculate)
  public skin: GetSet<string, this>;
  @getset(false)
  public playing: GetSet<boolean, this>;
  @getset(10)
  public fps: AnimatedGetSet<number, this>;
  @getset('', Sprite.prototype.recalculate)
  public mask: GetSet<string, this>;
  @getset('', Sprite.prototype.recalculate)
  public maskBlend: AnimatedGetSet<number, this>;

  private readonly animationData: SpriteData;
  private frame: FrameData = {
    height: 0,
    width: 0,
    url: '',
    data: [],
    fileName: '',
  };
  private frameId: number = 0;
  private task: Generator | null = null;
  private imageData: ImageData;
  private readonly computeCanvas: HTMLCanvasElement;

  public get context(): CanvasRenderingContext2D {
    return this.computeCanvas.getContext('2d');
  }

  constructor(config?: SpriteConfig) {
    super(config);
    this.animationData = config.animationData;
    this.computeCanvas = Util.createCanvasElement();
    this.computeCanvas.width = COMPUTE_CANVAS_SIZE;
    this.computeCanvas.height = COMPUTE_CANVAS_SIZE;

    this.recalculate();
  }

  _sceneFunc(context: Context) {
    const size = this.getSize();
    context.save();
    context._context.imageSmoothingEnabled = false;
    context.drawImage(
      this.computeCanvas,
      0,
      0,
      this.frame.width,
      this.frame.height,
      size.width / -2,
      size.height / -2,
      size.width,
      size.height,
    );
    context.restore();
  }

  private recalculate() {
    const skin = this.animationData?.skins[this.skin()];
    const animation = this.animationData?.animations[this.animation()];
    const mask = this.animationData?.skins[this.mask()];
    const blend = this.maskBlend();
    if (!animation || animation.frames.length === 0) return;

    this.frameId %= animation.frames.length;
    this.frame = animation.frames[this.frameId];
    this.offset(this.getOriginOffset());

    this.imageData = this.context.createImageData(
      this.frame.width,
      this.frame.height,
    );

    if (skin) {
      for (let y = 0; y < this.frame.height; y++) {
        for (let x = 0; x < this.frame.width; x++) {
          const id = this.positionToId({x, y});
          const skinX = this.frame.data[id];
          const skinY = this.frame.data[id + 1];
          const skinId = ((skin.height - 1 - skinY) * skin.width + skinX) * 4;

          this.imageData.data[id] = skin.data[skinId];
          this.imageData.data[id + 1] = skin.data[skinId + 1];
          this.imageData.data[id + 2] = skin.data[skinId + 2];
          this.imageData.data[id + 3] = Math.round(
            (this.frame.data[id + 3] / 255) *
              (skin.data[skinId + 3] / 255) *
              255,
          );

          if (mask) {
            this.imageData.data[id + 3] *= TimeTween.map(
              1,
              mask.data[id] / 255,
              blend,
            );
          }
        }
      }
    } else {
      this.imageData.data.set(this.frame.data);
    }

    this.context.putImageData(this.imageData, 0, 0);
    this.fire(SPRITE_CHANGE_EVENT);
    this.fireLayoutChange();
  }

  public play(): Generator {
    const runTask = this.playRunner();
    if (this.task) {
      const previousTask = this.task;
      this.task = (function* () {
        yield* cancel(previousTask);
        yield* runTask;
      })();
      GeneratorHelper.makeThreadable(this.task, runTask);
    } else {
      this.task = runTask;
    }

    return this.task;
  }

  public *stop() {
    if (this.task) {
      yield* cancel(this.task);
      this.task = null;
    }
  }

  @threadable()
  private *playRunner() {
    this.frameId = 0;
    while (this.task !== null) {
      if (this.playing()) {
        this.frameId++;
        this.recalculate();
      }
      yield* waitFor(1 / this.fps());
    }
  }

  @threadable()
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

  public getColorAt(position: Vector2d): string {
    const id = this.positionToId(position);
    return `rgba(${this.imageData.data[id]
      .toString()
      .padStart(3, ' ')}, ${this.imageData.data[id + 1]
      .toString()
      .padStart(3, ' ')}, ${this.imageData.data[id + 2]
      .toString()
      .padStart(3, ' ')}, ${this.imageData.data[id + 3] / 255})`;
  }

  public positionToId(position: Vector2d): number {
    return (position.y * this.imageData.width + position.x) * 4;
  }
}
