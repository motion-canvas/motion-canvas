import {Shape, ShapeProps} from './Shape';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {initial, signal} from '../decorators';

export interface CircleProps extends ShapeProps {
  startAngle?: SignalValue<number>;
  endAngle?: SignalValue<number>;
}

export class Circle extends Shape {
  @initial(0)
  @signal()
  public declare readonly startAngle: SimpleSignal<number, this>;

  @initial(360)
  @signal()
  public declare readonly endAngle: SimpleSignal<number, this>;

  public constructor(props: CircleProps) {
    super(props);
  }

  protected override getPath(): Path2D {
    const path = new Path2D();
    const start = (this.startAngle() / 180) * Math.PI;
    const end = (this.endAngle() / 180) * Math.PI;
    const {width, height} = this.computedSize();
    path.ellipse(0, 0, width / 2, height / 2, 0, start, end);
    return path;
  }

  protected override getRipplePath(): Path2D {
    const path = new Path2D();
    const rippleSize = this.rippleSize();
    const start = (this.startAngle() / 180) * Math.PI;
    const end = (this.endAngle() / 180) * Math.PI;
    const size = this.size();
    path.ellipse(
      0,
      0,
      size.x / 2 + rippleSize,
      size.y / 2 + rippleSize,
      0,
      start,
      end,
    );

    return path;
  }
}
