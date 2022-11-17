import {Signal, SignalValue} from '@motion-canvas/core/lib/utils';
import {Rect as RectType} from '@motion-canvas/core/lib/types';
import {Shape, ShapeProps} from './Shape';
import {property} from '../decorators';
import {drawRoundRect} from '../utils';

export interface RectProps extends ShapeProps {
  radius?: SignalValue<number>;
}

export class Rect extends Shape {
  @property(0)
  public declare readonly radius: Signal<number, this>;

  public constructor(props: RectProps) {
    super(props);
  }

  protected override getPath(): Path2D {
    const path = new Path2D();
    const radius = this.radius();
    const rect = RectType.fromSizeCentered(this.size());
    drawRoundRect(path, rect, radius);

    return path;
  }

  protected override getCacheRect(): RectType {
    return super.getCacheRect().expand(this.rippleSize());
  }

  protected override getRipplePath(): Path2D {
    const path = new Path2D();
    const rippleSize = this.rippleSize();
    const radius = this.radius() + rippleSize;
    const rect = RectType.fromSizeCentered(this.size()).expand(rippleSize);
    drawRoundRect(path, rect, radius);

    return path;
  }
}
