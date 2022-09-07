import {Context} from 'konva/lib/Context';
import {GetSet, Vector2d} from 'konva/lib/types';
import {waitFor} from '@motion-canvas/core/lib/flow';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {cached, KonvaNode, getset} from '../decorators';
import {GeneratorHelper} from '@motion-canvas/core/lib/helpers';
import {TimingFunction, map, tween} from '@motion-canvas/core/lib/tweening';
import {cancel, ThreadGenerator} from '@motion-canvas/core/lib/threading';
import {parseColor} from 'mix-color';
import {Shape, ShapeConfig} from 'konva/lib/Shape';
import {getImageData, ImageDataSource} from '@motion-canvas/core/lib/media';

export const SPRITE_CHANGE_EVENT = 'spriteChange';

export interface SpriteConfig extends ShapeConfig {
  animation: ImageDataSource[];
  skin?: ImageDataSource;
  mask?: ImageDataSource;
  playing?: boolean;
  fps?: number;
  maskBlend?: number;
  frame?: number;
}

/**
 * A class for animated sprites.
 *
 * @remarks
 * Allows to use custom alpha masks and skins.
 */
@KonvaNode()
export class Sprite extends Shape {
  @getset(null, Sprite.prototype.updateAnimation)
  public animation: GetSet<SpriteConfig['animation'], this>;
  @getset(0, Sprite.prototype.updateAnimation)
  public frame: GetSet<SpriteConfig['frame'], this>;
  @getset(false)
  public playing: GetSet<SpriteConfig['playing'], this>;
  @getset(10)
  public fps: GetSet<SpriteConfig['fps'], this>;

  /**
   * An image used for 2D UV mapping.
   */
  @getset(null, Sprite.prototype.updateSkin)
  public skin: GetSet<SpriteConfig['skin'], this>;

  /**
   * An image that defines which parts of the sprite should be visible.
   *
   * @remarks
   * The red channel is used for sampling.
   */
  @getset(null, Sprite.prototype.updateMask, Sprite.prototype.maskTween)
  public mask: GetSet<SpriteConfig['mask'], this>;

  /**
   * The blend between the original opacity and the opacity calculated using the
   * mask.
   */
  @getset(0, Sprite.prototype.updateFrame)
  public maskBlend: GetSet<SpriteConfig['maskBlend'], this>;

  private task: ThreadGenerator | null = null;
  private baseMask: ImageDataSource;
  private baseMaskBlend = 0;
  private synced = false;

  private readonly computeCanvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  public constructor(config?: SpriteConfig) {
    super(config);
    this.computeCanvas = document.createElement('canvas');
    this.context = this.computeCanvas.getContext('2d');
  }

  protected _sceneFunc(context: Context) {
    const size = this.getSize();
    let source: ImageDataSource = this.computeCanvas;
    if (this.requiresProcessing()) {
      // Make sure the compute canvas is up-to-date
      this.getFrameData();
    } else {
      const animation = this.animation();
      const frame = this.frame();
      source = animation[frame % animation.length];
    }

    context.save();
    context._context.imageSmoothingEnabled = false;
    context.drawImage(
      source,
      0,
      0,
      source.width,
      source.height,
      size.width / -2,
      size.height / -2,
      size.width,
      size.height,
    );
    context.restore();
  }

  private updateSkin() {
    this._clearCache(this.getSkinData);
    this.updateFrame();
  }

  private updateAnimation() {
    this._clearCache(this.getRawFrameData);
    this.updateFrame();
  }

  private updateMask() {
    this._clearCache(this.getMaskData);
    this.updateFrame();
  }

  private updateFrame() {
    this._clearCache(this.getFrameData);
  }

  @cached('Sprite.skinData')
  private getSkinData() {
    const skin = this.skin();
    return skin ? getImageData(skin) : null;
  }

  @cached('Sprite.maskData')
  private getMaskData() {
    const mask = this.mask();
    return mask ? getImageData(mask) : null;
  }

  @cached('Sprite.baseMaskData')
  private getBaseMaskData() {
    return this.baseMask ? getImageData(this.baseMask) : null;
  }

  @cached('Sprite.rawFrameData')
  private getRawFrameData() {
    const animation = this.animation();
    const frameId = this.frame() % animation.length;
    return getImageData(animation[frameId]);
  }

  @cached('Sprite.frameData')
  private getFrameData() {
    if (!this.requiresProcessing()) {
      return this.getRawFrameData();
    }

    const skin = this.skin();
    const mask = this.mask();
    const blend = this.maskBlend();
    const rawFrameData = this.getRawFrameData();
    const frameData = this.context.createImageData(rawFrameData);

    this.computeCanvas.width = rawFrameData.width;
    this.computeCanvas.height = rawFrameData.height;

    if (skin) {
      const skinData = this.getSkinData();
      for (let y = 0; y < rawFrameData.height; y++) {
        for (let x = 0; x < rawFrameData.width; x++) {
          const id = this.positionToId({x, y});
          const skinX = rawFrameData.data[id];
          const skinY = rawFrameData.data[id + 1];
          const skinId = ((skin.height - 1 - skinY) * skin.width + skinX) * 4;

          frameData.data[id] = skinData.data[skinId];
          frameData.data[id + 1] = skinData.data[skinId + 1];
          frameData.data[id + 2] = skinData.data[skinId + 2];
          frameData.data[id + 3] = Math.round(
            (rawFrameData.data[id + 3] / 255) *
              (skinData.data[skinId + 3] / 255) *
              255,
          );
        }
      }
    } else {
      frameData.data.set(rawFrameData.data);
    }

    if (mask || this.baseMask) {
      const maskData = this.getMaskData();
      const baseMaskData = this.getBaseMaskData();
      for (let y = 0; y < rawFrameData.height; y++) {
        for (let x = 0; x < rawFrameData.width; x++) {
          const id = this.positionToId({x, y});
          const maskValue = map(
            maskData?.data[id] ?? 255,
            baseMaskData?.data[id] ?? 255,
            this.baseMaskBlend,
          );
          frameData.data[id + 3] *= map(1, maskValue / 255, blend);
        }
      }
    }

    this.context.putImageData(frameData, 0, 0);
    this.fire(SPRITE_CHANGE_EVENT);

    return frameData;
  }

  private requiresProcessing(): boolean {
    return !!(this.skin() || this.mask() || this.baseMask);
  }

  /**
   * A generator that runs this sprite's animation.
   *
   * @remarks
   * For the animation to actually play, the {@link Sprite.playing} value has to
   * be set to `true`.
   *
   * Should be run concurrently:
   * ```ts
   * yield sprite.play();
   * ```
   */
  public play(): ThreadGenerator {
    const runTask = this.playRunner();
    if (this.task) {
      const previousTask = this.task;
      this.task = (function* (): ThreadGenerator {
        cancel(previousTask);
        yield* runTask;
      })();
      GeneratorHelper.makeThreadable(this.task, runTask);
    } else {
      this.task = runTask;
    }

    return this.task;
  }

  /**
   * Play the given animation once.
   *
   * @param animation - The animation to play.
   * @param next - An optional animation that should be switched to next. If not
   *               present the sprite will go back to the previous animation.
   */
  @threadable()
  public *playOnce(
    animation: ImageDataSource[],
    next: ImageDataSource[] = null,
  ): ThreadGenerator {
    next ??= this.animation();
    this.animation(animation);
    for (let i = 0; i < animation.length; i++) {
      this.frame(i);
      yield* waitFor(1 / this.fps());
    }
    this.animation(next);
  }

  /**
   * Cancel the current {@link Sprite.play} generator.
   *
   * @remarks
   * Should be used instead of manually canceling the generator.
   */
  @threadable()
  public *stop() {
    if (this.task) {
      cancel(this.task);
      this.task = null;
    }
  }

  @threadable('spriteAnimationRunner')
  private *playRunner(): ThreadGenerator {
    this.frame(0);
    while (this.task !== null) {
      if (this.playing()) {
        this.synced = true;
        this.frame(this.frame() + 1);
      } else {
        this.synced = false;
      }
      yield* waitFor(1 / this.fps());
    }
  }

  /**
   * Wait until the given frame is shown.
   *
   * @param frame - The frame to wait for.
   */
  @threadable()
  public *waitForFrame(frame: number): ThreadGenerator {
    let limit = 1000;
    while (
      this.frame() % this.animation().length !== frame &&
      limit > 0 &&
      !this.synced
    ) {
      limit--;
      yield;
    }

    if (limit === 0) {
      console.warn(`Sprite.waitForFrame cancelled`);
    }
  }

  @threadable()
  private *maskTween(
    from: ImageDataSource,
    to: ImageDataSource,
    time: number,
    timingFunction: TimingFunction,
    onEnd: () => void,
  ): ThreadGenerator {
    this.baseMask = from;
    this._clearCache(this.getBaseMaskData);

    this.baseMaskBlend = 1;
    this.mask(to);

    yield* tween(time, value => {
      this.baseMaskBlend = timingFunction(1 - value);
      this.updateFrame();
    });
    this.baseMask = null;
    this.baseMaskBlend = 0;
    onEnd();
  }

  public getColorAt(position: Vector2d): string {
    const id = this.positionToId(position);
    const frameData = this.getFrameData();
    return `rgba(${frameData.data[id]
      .toString()
      .padStart(3, ' ')}, ${frameData.data[id + 1]
      .toString()
      .padStart(3, ' ')}, ${frameData.data[id + 2]
      .toString()
      .padStart(3, ' ')}, ${frameData.data[id + 3] / 255})`;
  }

  public getParsedColorAt(position: Vector2d): ReturnType<typeof parseColor> {
    const id = this.positionToId(position);
    const frameData = this.getFrameData();
    return {
      r: frameData.data[id],
      g: frameData.data[id + 1],
      b: frameData.data[id + 2],
      a: frameData.data[id + 3],
    };
  }

  public positionToId(position: Vector2d): number {
    const frameData = this.getRawFrameData();
    return (position.y * frameData.width + position.x) * 4;
  }
}
