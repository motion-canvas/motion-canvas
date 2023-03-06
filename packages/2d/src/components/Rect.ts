import {
  PossibleSpacing,
  BBox,
  SpacingSignal,
} from '@motion-canvas/core/lib/types';
import {Shape, ShapeProps} from './Shape';
import {drawRoundRect} from '../utils';
import {initial, signal} from '../decorators';
import {spacingSignal} from '../decorators/spacingSignal';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';

export interface RectProps extends ShapeProps {
  radius?: SignalValue<PossibleSpacing>;

  /**
   * {@inheritDoc Rect.smoothCorners}
   */
  smoothCorners?: SignalValue<boolean>;

  /**
   * {@inheritDoc Rect.cornerSharpness}
   */
  cornerSharpness?: SignalValue<number>;
}

export class Rect extends Shape {
  @spacingSignal('radius')
  public declare readonly radius: SpacingSignal<this>;

  /**
   * Will set the corner drawing method to smooth corners.
   *
   * @remarks
   * Smooth corners are drawn continuously by a bezìer curves, rather than by a
   * quarter circle.
   *
   * When `smoothCorners` is set to `true`, the sharpness of the curve can be
   * controlled by the {@link Rect.cornerSharpness}.
   *
   * @example
   * ```tsx
   * <Rect
   *   width={300}
   *   height={300}
   *   smoothCorners={true}
   * />
   * ```
   */
  @initial(false)
  @signal()
  public declare readonly smoothCorners: SimpleSignal<boolean, this>;

  /**
   * Controlls the sharpness of the corners. {@link Rect.smoothCorners} must
   * be set to `true`.
   *
   * @remarks
   * By default the `cornerSharpness` is set to `0.6` which represents smooth,
   * circle-like rounding. At `0` the edges are squared off.
   *
   * @example
   * ```tsx
   * <Rect
   *   width={300}
   *   height={300}
   *   smoothCorners={true}
   *   cornerSharpness={0.7}
   * />
   * ```
   */
  @initial(0.6)
  @signal()
  public declare readonly cornerSharpness: SimpleSignal<number, this>;

  public constructor(props: RectProps) {
    super(props);
  }

  protected override getPath(): Path2D {
    const path = new Path2D();
    const radius = this.radius();
    const smoothCorners = this.smoothCorners();
    const cornerSharpness = this.cornerSharpness();
    const box = BBox.fromSizeCentered(this.size());
    drawRoundRect(path, box, radius, smoothCorners, cornerSharpness);

    return path;
  }

  protected override getCacheBBox(): BBox {
    return super.getCacheBBox().expand(this.rippleSize());
  }

  protected override getRipplePath(): Path2D {
    const path = new Path2D();
    const rippleSize = this.rippleSize();
    const radius = this.radius().addScalar(rippleSize);
    const smoothCorners = this.smoothCorners();
    const cornerSharpness = this.cornerSharpness();
    const box = BBox.fromSizeCentered(this.size()).expand(rippleSize);
    drawRoundRect(path, box, radius, smoothCorners, cornerSharpness);

    return path;
  }
}
