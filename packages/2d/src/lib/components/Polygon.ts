import {
  BBox,
  SerializedVector2,
  SignalValue,
  SimpleSignal,
  Vector2,
} from '@motion-canvas/core';
import {CurveProfile, getPolylineProfile} from '../curves';
import {computed, initial, signal} from '../decorators';
import {DesiredLength} from '../partials';
import {drawPolygon} from '../utils';
import {Curve, CurveProps} from './Curve';

export interface PolygonProps extends CurveProps {
  /**
   * {@inheritDoc Polygon.sides}
   */
  sides?: SignalValue<number>;
  /**
   * {@inheritDoc Polygon.radius}
   */
  radius?: SignalValue<number>;
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
 * will be particularly noticeable if the number of sides is low, e.g. for a
 * triangle.
 *
 * @preview
 * ```tsx editor
 * // snippet Polygon
 * import {makeScene2D, Polygon} from '@motion-canvas/2d';
 * import {createRef} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const ref = createRef<Polygon>();
 *   view.add(
 *     <Polygon
 *       ref={ref}
 *       sides={6}
 *       size={160}
 *       fill={'lightseagreen'}
 *     />
 *   );
 *
 *   yield* ref().sides(3, 2).to(6, 2);
 * });
 *
 * // snippet Pentagon outline
 * import {makeScene2D, Polygon} from '@motion-canvas/2d';
 *
 * export default makeScene2D(function* (view) {
 *   view.add(
 *     <Polygon
 *       sides={5}
 *       size={160}
 *       radius={30}
 *       stroke={'lightblue'}
 *       lineWidth={8}
 *     />
 *   );
 * });
 *
 * // snippet Accessing vertex data
 * import {Circle, Polygon, makeScene2D} from '@motion-canvas/2d';
 * import {createRef, range} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const polygon = createRef<Polygon>();
 *   view.add(
 *     <Polygon ref={polygon} sides={3} lineWidth={4} stroke={'white'} size={160}>
 *       {range(6).map(index => (
 *         <Circle
 *           fill={'white'}
 *           size={20}
 *           position={() => polygon().vertex(index)}
 *           opacity={() => polygon().vertexCompletion(index)}
 *         />
 *       ))}
 *     </Polygon>,
 *   );
 *
 *   yield* polygon().sides(6, 2).wait(0.5).back(2);
 * });
 * ```
 */
export class Polygon extends Curve {
  /**
   * The number of sides of the polygon.
   *
   * @remarks
   * For example, a value of 6 creates a hexagon.
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

  /**
   * The radius of the polygon's corners.
   *
   * @example
   * ```tsx
   * <Polygon
   *   radius={30}
   *   size={320}
   *   sides={3}
   *   stroke={'#fff'}
   *   lineWidth={8}
   * />
   * ```
   */
  @initial(0)
  @signal()
  public declare readonly radius: SimpleSignal<number, this>;

  public constructor(props: PolygonProps) {
    super(props);
  }

  /**
   * Get the position of the nth vertex in the local space of this polygon.
   *
   * @param index - The index of the vertex.
   */
  public vertex(index: number): Vector2 {
    const size = this.computedSize().scale(0.5);
    const theta = (index * 2 * Math.PI) / this.sides();
    const direction = Vector2.fromRadians(theta).perpendicular;
    return direction.mul(size);
  }

  /**
   * Get the completion of the nth vertex.
   *
   * @remarks
   * The completion is a value between `0` and `1` that describes how the given
   * vertex partakes in the polygon.
   *
   * For integer values of {@link sides}, the completion is simply `1` for
   * each index making up the polygon and `0` for any other index. If `sides`
   * includes a fraction, the last index of the polygon will have a completion
   * equal to said fraction.
   *
   * Check out the {@link Polygon | Accessing vertex data} example for a
   * demonstration.
   *
   * @param index - The index of the vertex.
   */
  public vertexCompletion(index: number): number {
    const sides = this.sides();
    if (index < 0 || index > sides) {
      return 0;
    }

    if (index < sides - 1) {
      return 1;
    }

    return sides - index;
  }

  @computed()
  public override profile(): CurveProfile {
    const sides = this.sides();
    const radius = this.radius();

    const points = [];
    const size = this.computedSize().scale(0.5);
    for (let i = 0; i < sides; i++) {
      const theta = (i * 2 * Math.PI) / sides;
      const direction = Vector2.fromRadians(theta).perpendicular;
      points.push(direction.mul(size));
    }

    return getPolylineProfile(points, radius, true);
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    return {
      x: this.width.context.getter(),
      y: this.height.context.getter(),
    };
  }

  protected override offsetComputedLayout(box: BBox): BBox {
    return box;
  }

  protected override childrenBBox(): BBox {
    return BBox.fromSizeCentered(this.computedSize());
  }

  protected override requiresProfile(): boolean {
    return super.requiresProfile() || this.radius() > 0;
  }

  protected override getPath(): Path2D {
    if (this.requiresProfile()) {
      return this.curveDrawingInfo().path;
    }

    return this.createPath();
  }
  protected override getRipplePath(): Path2D {
    return this.createPath(this.rippleSize());
  }

  protected createPath(expand = 0) {
    const path = new Path2D();
    const sides = this.sides();
    const box = BBox.fromSizeCentered(this.size()).expand(expand);
    drawPolygon(path, box, sides);
    return path;
  }
}
