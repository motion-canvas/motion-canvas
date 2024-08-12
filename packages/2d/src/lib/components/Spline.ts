import {
  BBox,
  PossibleVector2,
  SerializedVector2,
  SignalValue,
  SimpleSignal,
  Vector2,
  unwrap,
  useLogger,
} from '@motion-canvas/core';
import {
  CubicBezierSegment,
  CurveProfile,
  KnotInfo,
  getBezierSplineProfile,
} from '../curves';
import {PolynomialSegment} from '../curves/PolynomialSegment';
import {computed, initial, signal} from '../decorators';
import {DesiredLength} from '../partials';
import {
  arc,
  bezierCurveTo,
  drawLine,
  drawPivot,
  lineTo,
  moveTo,
  quadraticCurveTo,
} from '../utils';
import {Curve, CurveProps} from './Curve';
import {Knot} from './Knot';
import {Node} from './Node';
import splineWithInsufficientKnots from './__logs__/spline-with-insufficient-knots.md';

export interface SplineProps extends CurveProps {
  /**
   * {@inheritDoc Spline.smoothness}
   */
  smoothness?: SignalValue<number>;

  /**
   * {@inheritDoc Spline.points}
   */
  points?: SignalValue<SignalValue<PossibleVector2[]>>;
}

/**
 * A node for drawing a smooth line through a number of points.
 *
 * @remarks
 * This node uses Bézier curves for drawing each segment of the spline.
 *
 * @example
 * Defining knots using the `points` property. This will automatically
 * calculate the handle positions for each knot do draw a smooth curve. You
 * can control the smoothness of the resulting curve via the
 * {@link Spline.smoothness} property:
 *
 * ```tsx
 * <Spline
 *   lineWidth={4}
 *   stroke={'white'}
 *   smoothness={0.4}
 *   points={[
 *     [-400, 0],
 *     [-200, -300],
 *     [0, 0],
 *     [200, -300],
 *     [400, 0],
 *   ]}
 * />
 * ```
 *
 * Defining knots with {@link Knot} nodes:
 *
 * ```tsx
 * <Spline lineWidth={4} stroke={'white'}>
 *   <Knot position={[-400, 0]} />
 *   <Knot position={[-200, -300]} />
 *   <Knot
 *     position={[0, 0]}
 *     startHandle={[-100, 200]}
 *     endHandle={[100, 200]}
 *   />
 *   <Knot position={[200, -300]} />
 *   <Knot position={[400, 0]} />
 * </Spline>
 * ```
 */
export class Spline extends Curve {
  /**
   * The smoothness of the spline when using auto-calculated handles.
   *
   * @remarks
   * This property is only applied to knots that don't use explicit handles.
   *
   * @defaultValue 0.4
   */
  @initial(0.4)
  @signal()
  public declare readonly smoothness: SimpleSignal<number>;

  /**
   * The knots of the spline as an array of knots with auto-calculated handles.
   *
   * @remarks
   * You can control the smoothness of the resulting curve
   * via the {@link smoothness} property.
   */
  @initial(null)
  @signal()
  public declare readonly points: SimpleSignal<
    SignalValue<PossibleVector2>[] | null,
    this
  >;

  public constructor(props: SplineProps) {
    super(props);

    if (
      (props.children === undefined ||
        !Array.isArray(props.children) ||
        props.children.length < 2) &&
      (props.points === undefined ||
        (typeof props.points !== 'function' && props.points.length < 2)) &&
      props.spawner === undefined
    ) {
      useLogger().warn({
        message:
          'Insufficient number of knots specified for spline. A spline needs at least two knots.',
        remarks: splineWithInsufficientKnots,
        inspect: this.key,
      });
    }
  }

  @computed()
  public override profile(): CurveProfile {
    return getBezierSplineProfile(
      this.knots(),
      this.closed(),
      this.smoothness(),
    );
  }

  @computed()
  public knots(): KnotInfo[] {
    const points = this.points();

    if (points) {
      return points.map(signal => {
        const point = new Vector2(unwrap(signal));

        return {
          position: point,
          startHandle: point,
          endHandle: point,
          auto: {start: 1, end: 1},
        };
      });
    }

    return this.children()
      .filter(this.isKnot)
      .map(knot => knot.points());
  }

  @computed()
  protected childrenBBox() {
    const points = (this.profile().segments as PolynomialSegment[]).flatMap(
      segment => segment.points,
    );
    return BBox.fromPoints(...points);
  }

  protected override lineWidthCoefficient(): number {
    const join = this.lineJoin();

    let coefficient = super.lineWidthCoefficient();

    if (join !== 'miter') {
      return coefficient;
    }

    const {minSin} = this.profile();
    if (minSin > 0) {
      coefficient = Math.max(coefficient, 0.5 / minSin);
    }

    return coefficient;
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    return this.getTightBBox().size;
  }

  protected override offsetComputedLayout(box: BBox): BBox {
    box.position = box.position.sub(this.getTightBBox().center);
    return box;
  }

  @computed()
  private getTightBBox(): BBox {
    const bounds = (this.profile().segments as PolynomialSegment[]).map(
      segment => segment.getBBox(),
    );
    return BBox.fromBBoxes(...bounds);
  }

  public override drawOverlay(
    context: CanvasRenderingContext2D,
    matrix: DOMMatrix,
  ) {
    const size = this.computedSize();
    const box = this.childrenBBox().transformCorners(matrix);
    const offset = size.mul(this.offset()).scale(0.5).transformAsPoint(matrix);
    const segments = this.profile().segments as PolynomialSegment[];

    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.fillStyle = 'white';

    const splinePath = new Path2D();

    // Draw the actual spline first so that all control points get drawn on top of it.
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const [from, startHandle, endHandle, to] =
        segment.transformPoints(matrix);

      moveTo(splinePath, from);
      if (segment instanceof CubicBezierSegment) {
        bezierCurveTo(splinePath, startHandle, endHandle, to as Vector2);
      } else {
        quadraticCurveTo(splinePath, startHandle, endHandle);
      }
    }
    context.stroke(splinePath);

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      context.fillStyle = 'white';

      const [from, startHandle, endHandle, to] =
        segment.transformPoints(matrix);

      const handlePath = new Path2D();

      context.globalAlpha = 0.5;
      // Line from p0 to p1
      moveTo(handlePath, from);
      lineTo(handlePath, startHandle);

      if (segment instanceof CubicBezierSegment) {
        // Line from p2 to p3
        moveTo(handlePath, endHandle);
        lineTo(handlePath, to as Vector2);
        context.beginPath();
        context.stroke(handlePath);
      } else {
        // Line from p1 to p2
        lineTo(handlePath, endHandle);
        context.beginPath();
        context.stroke(handlePath);
      }

      context.globalAlpha = 1;
      context.lineWidth = 2;

      // Draw first point of segment
      moveTo(context, from);
      context.beginPath();
      arc(context, from, 4);
      context.closePath();
      context.stroke();
      context.fill();

      // Draw final point of segment only if we're on the last segment.
      // Otherwise, it will get drawn as the start point of the next segment.
      if (i === segments.length - 1) {
        if (to !== undefined) {
          moveTo(context, to);
          context.beginPath();
          arc(context, to, 4);
          context.closePath();
          context.stroke();
          context.fill();
        }
      }

      // Draw the control points
      context.fillStyle = 'black';
      for (const point of [startHandle, endHandle]) {
        if (point.magnitude > 0) {
          moveTo(context, point);
          context.beginPath();
          arc(context, point, 4);
          context.closePath();
          context.fill();
          context.stroke();
        }
      }
    }

    context.lineWidth = 1;
    context.beginPath();
    drawPivot(context, offset);
    context.stroke();

    context.beginPath();
    drawLine(context, box);
    context.closePath();
    context.stroke();
  }

  private isKnot(node: Node): node is Knot {
    return node instanceof Knot;
  }
}
