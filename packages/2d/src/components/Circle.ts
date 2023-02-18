import {Shape, ShapeProps} from './Shape';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {initial, signal} from '../decorators';

export interface CircleProps extends ShapeProps {
  /**
   * {@inheritDoc Circle.startAngle}
   */
  startAngle?: SignalValue<number>;
  /**
   * {@inheritDoc Circle.endAngle}
   */
  endAngle?: SignalValue<number>;
  /**
   * {@inheritDoc Circle.closed}
   */
  closed?: SignalValue<boolean>;
}

/**
 * A node for drawing circular shapes.
 *
 * @remarks
 * This node can be used to render shapes such as: circle, ellipse, arc, and
 * sector (pie chart).
 *
 * @example
 * A simple circle:
 * ```tsx
 * <Circle
 *   size={300}
 *   fill={'lightseagreen'}
 * />
 * ```
 * An ellipse:
 * ```tsx
 * <Circle
 *   width={300}
 *   height={100}
 *   fill={'lightseagreen'}
 * />
 * ```
 * A sector (pie chart):
 * ```tsx
 * <Circle
 *   size={300}
 *   fill={'lightseagreen'}
 *   startAngle={30}
 *   endAngle={270}
 *   closed={true}
 * />
 * ```
 * An arc:
 * ```tsx
 * <Circle
 *   size={300}
 *   stroke={'lightseagreen'}
 *   lineWidth={8}
 *   startAngle={-90}
 *   endAngle={90}
 * />
 * ```
 */
export class Circle extends Shape {
  /**
   * The starting angle in degrees for the circle sector.
   *
   * @remarks
   * This property can be used together with {@link startAngle} to turn this
   * circle into a sector (when using fill) or an arc (when using stroke).
   *
   * @default 0
   */
  @initial(0)
  @signal()
  public declare readonly startAngle: SimpleSignal<number, this>;

  /**
   * The ending angle in degrees for the circle sector.
   *
   * @remarks
   * This property can be used together with {@link endAngle} to turn this
   * circle into a sector (when using fill) or an arc (when using stroke).
   *
   * @default 360
   */
  @initial(360)
  @signal()
  public declare readonly endAngle: SimpleSignal<number, this>;

  /**
   * Whether the path of this circle should be closed.
   *
   * @remarks
   * When set to true, the path of this circle will start and end at the center.
   * This can be used to fine-tune how sectors are rendered.
   *
   * @example
   * A closed circle will look like a pie chart:
   * ```tsx
   * <Circle
   *   size={300}
   *   fill={'lightseagreen'}
   *   endAngle={230}
   *   closed={true}
   * />
   * ```
   * An open one will look like an arc:
   * ```tsx
   * <Circle
   *   size={300}
   *   stroke={'lightseagreen'}
   *   lineWidth={8}
   *   endAngle={230}
   *   closed={false}
   * />
   * ```
   *
   * @default false
   */
  @initial(false)
  @signal()
  public declare readonly closed: SimpleSignal<boolean, this>;

  public constructor(props: CircleProps) {
    super(props);
  }

  protected override getPath(): Path2D {
    return this.createPath();
  }

  protected override getRipplePath(): Path2D {
    return this.createPath(this.rippleSize());
  }

  protected createPath(expand = 0) {
    const path = new Path2D();
    const start = (this.startAngle() / 180) * Math.PI;
    const end = (this.endAngle() / 180) * Math.PI;
    const size = this.size().scale(0.5);
    const closed = this.closed();
    if (closed) {
      path.moveTo(0, 0);
    }
    path.ellipse(0, 0, size.x + expand, size.y + expand, 0, start, end);
    if (closed) {
      path.closePath();
    }

    return path;
  }
}
