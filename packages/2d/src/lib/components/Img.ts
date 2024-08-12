import {
  BBox,
  Color,
  DependencyContext,
  DetailedError,
  PossibleVector2,
  SerializedVector2,
  SignalValue,
  SimpleSignal,
  Vector2,
  useLogger,
  viaProxy,
} from '@motion-canvas/core';
import {computed, initial, nodeName, signal} from '../decorators';
import {DesiredLength} from '../partials';
import {drawImage} from '../utils';
import {Rect, RectProps} from './Rect';
import imageWithoutSource from './__logs__/image-without-source.md';

export interface ImgProps extends RectProps {
  /**
   * {@inheritDoc Img.src}
   */
  src?: SignalValue<string | null>;
  /**
   * {@inheritDoc Img.alpha}
   */
  alpha?: SignalValue<number>;
  /**
   * {@inheritDoc Img.smoothing}
   */
  smoothing?: SignalValue<boolean>;
}

/**
 * A node for displaying images.
 *
 * @preview
 * ```tsx editor
 * import {Img} from '@motion-canvas/2d';
 * import {all, waitFor} from '@motion-canvas/core';
 * import {createRef} from '@motion-canvas/core';
 * import {makeScene2D} from '@motion-canvas/2d';
 *
 * export default makeScene2D(function* (view) {
 *   const ref = createRef<Img>();
 *   yield view.add(
 *     <Img
 *       ref={ref}
 *       src="https://images.unsplash.com/photo-1679218407381-a6f1660d60e9"
 *       width={300}
 *       radius={20}
 *     />,
 *   );
 *
 *   // set the background using the color sampled from the image:
 *   ref().fill(ref().getColorAtPoint(0));
 *
 *   yield* all(
 *     ref().size([100, 100], 1).to([300, null], 1),
 *     ref().radius(50, 1).to(20, 1),
 *     ref().alpha(0, 1).to(1, 1),
 *   );
 *   yield* waitFor(0.5);
 * });
 * ```
 */
@nodeName('Img')
export class Img extends Rect {
  private static pool: Record<string, HTMLImageElement> = {};

  static {
    if (import.meta.hot) {
      import.meta.hot.on('motion-canvas:assets', ({urls}) => {
        for (const url of urls) {
          if (Img.pool[url]) {
            delete Img.pool[url];
          }
        }
      });
    }
  }

  /**
   * The source of this image.
   *
   * @example
   * Using a local image:
   * ```tsx
   * import image from './example.png';
   * // ...
   * view.add(<Img src={image} />)
   * ```
   * Loading an image from the internet:
   * ```tsx
   * view.add(<Img src="https://example.com/image.png" />)
   * ```
   */
  @signal()
  public declare readonly src: SimpleSignal<string, this>;

  /**
   * The alpha value of this image.
   *
   * @remarks
   * Unlike opacity, the alpha value affects only the image itself, leaving the
   * fill, stroke, and children intact.
   */
  @initial(1)
  @signal()
  public declare readonly alpha: SimpleSignal<number, this>;

  /**
   * Whether the image should be smoothed.
   *
   * @remarks
   * When disabled, the image will be scaled using the nearest neighbor
   * interpolation with no smoothing. The resulting image will appear pixelated.
   *
   * @defaultValue true
   */
  @initial(true)
  @signal()
  public declare readonly smoothing: SimpleSignal<boolean, this>;

  public constructor(props: ImgProps) {
    super(props);
    if (!('src' in props)) {
      useLogger().warn({
        message: 'No source specified for the image',
        remarks: imageWithoutSource,
        inspect: this.key,
      });
    }
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    const custom = super.desiredSize();
    if (custom.x === null && custom.y === null) {
      const image = this.image();
      return {
        x: image.naturalWidth,
        y: image.naturalHeight,
      };
    }

    return custom;
  }

  @computed()
  protected image(): HTMLImageElement {
    const rawSrc = this.src();
    let src = '';
    let key = '';
    if (rawSrc) {
      key = viaProxy(rawSrc);
      const url = new URL(key, window.location.origin);
      if (url.origin === window.location.origin) {
        const hash = this.view().assetHash();
        url.searchParams.set('asset-hash', hash);
      }
      src = url.toString();
    }

    let image = Img.pool[key];
    if (!image) {
      image = document.createElement('img');
      image.crossOrigin = 'anonymous';
      image.src = src;
      Img.pool[key] = image;
    }

    if (!image.complete) {
      DependencyContext.collectPromise(
        new Promise((resolve, reject) => {
          image.addEventListener('load', resolve);
          image.addEventListener('error', () =>
            reject(
              new DetailedError({
                message: `Failed to load an image`,
                remarks: `\
The <code>src</code> property was set to:
<pre><code>${rawSrc}</code></pre>
...which resolved to the following url:
<pre><code>${src}</code></pre>
Make sure that source is correct and that the image exists.<br/>
<a target='_blank' href='https://motioncanvas.io/docs/media#images'>Learn more</a>
about working with images.`,
                inspect: this.key,
              }),
            ),
          );
        }),
      );
    }

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
    const alpha = this.alpha();
    if (alpha > 0) {
      const box = BBox.fromSizeCentered(this.computedSize());
      context.save();
      context.clip(this.getPath());
      if (alpha < 1) {
        context.globalAlpha *= alpha;
      }
      context.imageSmoothingEnabled = this.smoothing();
      drawImage(context, this.image(), box);
      context.restore();
    }

    if (this.clip()) {
      context.clip(this.getPath());
    }

    this.drawChildren(context);
  }

  protected override applyFlex() {
    super.applyFlex();
    const image = this.image();
    this.element.style.aspectRatio = (
      this.ratio() ?? image.naturalWidth / image.naturalHeight
    ).toString();
  }

  /**
   * Get color of the image at the given position.
   *
   * @param position - The position in local space at which to sample the color.
   */
  public getColorAtPoint(position: PossibleVector2): Color {
    const size = this.computedSize();
    const naturalSize = this.naturalSize();

    const pixelPosition = new Vector2(position)
      .add(this.computedSize().scale(0.5))
      .mul(naturalSize.div(size).safe);

    return this.getPixelColor(pixelPosition);
  }

  /**
   * The natural size of this image.
   *
   * @remarks
   * The natural size is the size of the source image unaffected by the size
   * and scale properties.
   */
  @computed()
  public naturalSize() {
    const image = this.image();
    return new Vector2(image.naturalWidth, image.naturalHeight);
  }

  /**
   * Get color of the image at the given pixel.
   *
   * @param position - The pixel's position.
   */
  public getPixelColor(position: PossibleVector2): Color {
    const context = this.filledImageCanvas();
    const vector = new Vector2(position);
    const data = context.getImageData(vector.x, vector.y, 1, 1).data;

    return new Color({
      r: data[0],
      g: data[1],
      b: data[2],
      a: data[3] / 255,
    });
  }

  protected override collectAsyncResources() {
    super.collectAsyncResources();
    this.image();
  }
}
