import {
  collectPromise,
  Signal,
  SignalValue,
} from '@motion-canvas/core/lib/utils';
import {computed, initial, property} from '../decorators';
import {Color, Rect as RectType, Vector2} from '@motion-canvas/core/lib/types';
import {drawImage} from '../utils';
import {Rect, RectProps} from './Rect';
import {View2D} from '../scenes';

export interface ImageProps extends RectProps {
  src?: SignalValue<string>;
  alpha?: SignalValue<number>;
  smoothing?: SignalValue<boolean>;
}

export class Image extends Rect {
  private static pool: Record<string, HTMLImageElement> = {};

  @property()
  public declare readonly src: Signal<string, this>;

  @initial(1)
  @property()
  public declare readonly alpha: Signal<number, this>;

  @initial(true)
  @property()
  public declare readonly smoothing: Signal<boolean, this>;

  public constructor(props: ImageProps) {
    super(props);
  }

  @computed()
  protected image(): HTMLImageElement {
    const src = this.src();
    if (Image.pool[src]) {
      return Image.pool[src];
    }

    const image = View2D.document.createElement('img');
    image.src = src;
    if (!image.complete) {
      collectPromise(
        new Promise((resolve, reject) => {
          image.addEventListener('load', resolve);
          image.addEventListener('error', reject);
        }),
      );
    }
    Image.pool[src] = image;

    return image;
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
  protected filledImageCanvas() {
    const context = this.imageCanvas();
    const image = this.image();
    context.canvas.width = image.naturalWidth;
    context.canvas.height = image.naturalHeight;
    context.imageSmoothingEnabled = this.smoothing();
    context.drawImage(image, 0, 0);

    return context;
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
      drawImage(context, this.image(), rect);
      context.restore();
    }
    this.drawChildren(context);
  }

  protected override applyFlex() {
    super.applyFlex();
    const image = this.image();
    this.element.style.aspectRatio = this.parseValue(
      this.ratio() ?? image.naturalWidth / image.naturalHeight,
    );
  }

  public getColorAtPoint(position: Vector2): Color {
    const context = this.filledImageCanvas();
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

  protected override collectAsyncResources() {
    super.collectAsyncResources();
    this.image();
  }
}
