import {
  PossibleSpacing,
  Rect as RectType,
  SpacingSignal,
} from '@motion-canvas/core/lib/types';
import {Shape, ShapeProps} from './Shape';
import {drawRoundRect} from '../utils';
import {initial, signal} from '../decorators';
import {spacingSignal} from '../decorators/spacingSignal';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';

export interface RectProps extends ShapeProps {
  radius?: SignalValue<PossibleSpacing>;
  smoothCorners?: SignalValue<boolean>;
  cornerSharpness?: SignalValue<number>;
}

export class Rect extends Shape {
  @spacingSignal('radius')
  public declare readonly radius: SpacingSignal<this>;

  @initial(false)
  @signal()
  public declare readonly smoothCorners: SimpleSignal<boolean, this>;

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
    const rect = RectType.fromSizeCentered(this.size());
    drawRoundRect(path, rect, radius, smoothCorners, cornerSharpness);

    return path;
  }

  protected override getCacheRect(): RectType {
    return super.getCacheRect().expand(this.rippleSize());
  }

  protected override getRipplePath(): Path2D {
    const path = new Path2D();
    const rippleSize = this.rippleSize();
    const radius = this.radius().addScalar(rippleSize);
    const smoothCorners = this.smoothCorners();
    const cornerSharpness = this.cornerSharpness();
    const rect = RectType.fromSizeCentered(this.size()).expand(rippleSize);
    drawRoundRect(path, rect, radius, smoothCorners, cornerSharpness);

    return path;
  }
}
