import {BBox} from '@motion-canvas/core/lib/types';
import {Shape, ShapeProps} from './Shape';
import {initial, signal} from '../decorators';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {drawPolygon} from '../utils';

export interface PolygonProps extends ShapeProps {
  /**
   * {@inheritDoc Polygon.sides}
   */
  sides?: SignalValue<number>;
}

/**
 * A node for drawing regular polygons.
 *
 * @remarks
 * This node can be used to render shapes such as: triangle, pentagon,
 * hexagon and more.
 *
 * Note that the polygon is inscribed in a circle defined by the height
 * and width. If height and width are unequal, the polygon is inscribed
 * in the resulting ellipse.
 *
 * Since the polygon is inscribed in the circle, the actual displayed
 * height and width may differ somewhat from the bounding rectangle. This
 * will be particularly noticable if the number of sides is low, e.g. for a
 * triangle.
 *
 * @example
 * A hexagon:
 * ```tsx
 * <Polygon
 *   sides={6}
 *   size={300}
 *   fill={'lightseagreen'}
 * />
 * ```
 * A pentagon outline:
 * ```tsx
 * <Polygon
 *   sides={5}
 *   size={300}
 *   stroke={'lightblue'}
 *   lineWidth={8}
 * />
 * ```
 */
export class Polygon extends Shape {
  /**
   * Sets the number of sides of the polygon.
   *
   * @remarks
   * For example, a value of 6 creates a hexagon.
   *
   *
   * @example
   * ```tsx
   * <Polygon
   *   size={320}
   *   sides={7}
   *   stroke={'#fff'}
   *   lineWidth={8}
   *   fill={'lightseagreen'}
   * />
   * ```
   */
  @initial(6)
  @signal()
  public declare readonly sides: SimpleSignal<number, this>;

  public constructor(props: PolygonProps) {
    super(props);
  }

  protected override getPath(): Path2D {
    const path = new Path2D();
    const sides = this.sides();

    const box = BBox.fromSizeCentered(this.size());
    drawPolygon(path, box, sides);

    return path;
  }
  protected override getRipplePath(): Path2D {
    const path = new Path2D();
    const sides = this.sides();
    const rippleSize = this.rippleSize();

    const box = BBox.fromSizeCentered(this.size()).expand(rippleSize);
    drawPolygon(path, box, sides);

    return path;
  }
}
