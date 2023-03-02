import {Shape, ShapeProps} from './Shape';
import {initial, signal} from '../decorators';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';

export interface PolygonProps extends ShapeProps {
  /**
   * {@inheritDoc Polygon.nSides}
   */
  nSides?: SignalValue<number>;

  /**
   * {@inheritDoc Polygon.angle}
   */
  angle?: SignalValue<number>;
}

export class Polygon extends Shape {
  /**
   * Sets the number of sides of the polygon. For example, a value of 6
   * creates a hexagon.
   *
   * @remarks
   * Note that the polygon is inscribed in a circle defined by the height
   * and width. If height and width are unequal, the polygon is inscribed
   * in the resulting ellipse.
   *
   * Since the polygon is inscribed in the circle, the actual displayed
   * height and width may differ somewhat from the bounding rectangle. This
   * will be particularly noticable if the number of sides is low, e.g. for a
   * triangle.
   *
   *
   * @example
   * ```tsx
   * <Polygon
   *   x={0}
   *   y={0}
   *   width={320}
   *   height={320}
   *   nSides={6}
   *   stroke={'#fff'}
   *   lineWidth={8}
   *   fill={'lightseagreen'}
   * />
   * ```
   */
  @initial(6)
  @signal()
  public declare readonly nSides: SimpleSignal<number, this>;

  /**
   * Changes the starting angle (in degrees) of the polygon.
   *
   * @remarks
   * Use this to change the apparent rotation of the polygon.
   *
   * @example
   * ```tsx
   * <Polygon
   *   x={0}
   *   y={0}
   *   width={320}
   *   height={320}
   *   nSides={6}
   *   angle={30}
   *   stroke={'#fff'}
   *   lineWidth={8}
   *   fill={'lightseagreen'}
   * />
   * ```
   */
  @initial(0)
  @signal()
  public declare readonly angle: SimpleSignal<number, this>;

  public constructor(props: PolygonProps) {
    super(props);
  }

  protected override getPath(): Path2D {
    const path = new Path2D();
    const angle = (this.angle() / 360) * 2 * Math.PI;
    const width = this.width() / 2;
    const height = this.height() / 2;
    const nSides = this.nSides();
    let x0 = 0;
    let y0 = 0;

    for (let i = 0; i <= nSides; i += 1) {
      const theta = (i * 2 * Math.PI) / nSides - angle;
      const x = width * Math.sin(theta);
      const y = -height * Math.cos(theta);
      if (i == 0) {
        path.moveTo(x, y);
        x0 = x;
        y0 = y;
      } else {
        path.lineTo(x, y);
      }
    }
    path.lineTo(x0, y0);
    return path;
  }
}
