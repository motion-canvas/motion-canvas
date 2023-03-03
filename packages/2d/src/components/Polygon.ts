import {
  // PossibleSpacing,
  BBox,
  // SpacingSignal,
} from '@motion-canvas/core/lib/types';
import {Shape, ShapeProps} from './Shape';
import {initial, signal} from '../decorators';
import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';

function drawPolygon(
  path: CanvasRenderingContext2D | Path2D,
  rect: BBox,
  // width: number,
  // height: number,
  sides: number,
) {
  const width = rect.width / 2;
  const height = rect.height / 2;
  for (let i = 0; i <= sides; i += 1) {
    const theta = (i * 2 * Math.PI) / sides;
    const x = width * Math.sin(theta);
    const y = -height * Math.cos(theta);
    if (i == 0) {
      path.moveTo(x, y);
    } else {
      path.lineTo(x, y);
    }
  }
  path.closePath();
}

export interface PolygonProps extends ShapeProps {
  /**
   * {@inheritDoc Polygon.sides}
   */
  sides?: SignalValue<number>;
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
   *   sides={6}
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

    // const box = BBox.fromSizeCentered(this.size());
    const box = BBox.fromSizeCentered(this.size()).expand(rippleSize);
    drawPolygon(path, box, sides);

    return path;
  }
}
