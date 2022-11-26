import {Signal, SignalValue} from '@motion-canvas/core/lib/utils';
import {computed, initial, property} from '../decorators';
import {Color, Rect as RectType, Vector2} from '@motion-canvas/core/lib/types';
import {drawImage} from '../utils';
import {Rect, RectProps} from './Rect';

export interface ImageProps extends RectProps {
  src?: SignalValue<string>;
  alpha?: SignalValue<number>;
  smoothing?: SignalValue<boolean>;
}

export class Image extends Rect {
  @property()
  public declare readonly src: Signal<string, this>;

  @initial(1)
  @property()
  public declare readonly alpha: Signal<number, this>;

  @initial(true)
  @property()
  public declare readonly smoothing: Signal<boolean, this>;

  protected readonly image: HTMLImageElement;

  public constructor(props: ImageProps) {
    super({
      ...props,
      tagName: 'img',
    });
    this.image = <HTMLImageElement>this.element;
  }

  protected override draw(context: CanvasRenderingContext2D) {
    this.drawShape(context);
    if (this.clip()) {
      context.clip(this.getPath());
    }
    const alpha = this.alpha();
    if (alpha > 0) {
      const rect = RectType.fromSizeCentered(this.computedSize());
      context.save();
      if (alpha < 1) {
        context.globalAlpha *= alpha;
      }
      context.imageSmoothingEnabled = this.smoothing();
      drawImage(context, this.image, rect);
      context.restore();
    }
    this.drawChildren(context);
  }

  protected override updateLayout() {
    this.applySrc();
    super.updateLayout();
  }

  @computed()
  protected applySrc() {
    this.image.src = this.src();
  }

  @computed()
  protected imageCanvas(): CanvasRenderingContext2D {
    const canvas = document
      .createElement('canvas')
      .getContext('2d', {willReadFrequently: true});
    if (!canvas) {
      throw new Error('Could not create an image canvas');
    }

    return canvas;
  }

  @computed()
  protected imageDrawnCanvas() {
    this.applySrc();
    const context = this.imageCanvas();
    context.canvas.width = this.image.naturalWidth;
    context.canvas.height = this.image.naturalHeight;
    context.imageSmoothingEnabled = this.smoothing();
    context.drawImage(this.image, 0, 0);

    return context;
  }

  public getColorAtPoint(position: Vector2): any {
    const context = this.imageDrawnCanvas();
    const relativePosition = position.add(this.computedSize().scale(0.5));
    const data = context.getImageData(
      relativePosition.x,
      relativePosition.y,
      1,
      1,
    ).data;

    return new Color({
      r: data[0] / 255,
      g: data[1] / 255,
      b: data[2] / 255,
      a: data[3] / 255,
    });
  }

  protected override collectAsyncResources(deps: Promise<any>[]) {
    super.collectAsyncResources(deps);
    this.applySrc();
    if (!this.image.complete) {
      deps.push(
        new Promise((resolve, reject) => {
          this.image.addEventListener('load', resolve);
          this.image.addEventListener('error', reject);
        }),
      );
    }
  }
}
