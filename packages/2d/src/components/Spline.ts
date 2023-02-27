import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {Line, LineProps} from './Line';
import {Node} from './Node';
import {
  CubicBezierSegment,
  CurveProfile,
  getBezierSplineProfile,
  KnotInfo,
} from '../curves';
import {computed, initial, signal} from '../decorators';
import {
  arc,
  bezierCurveTo,
  drawLine,
  lineTo,
  moveTo,
  quadraticCurveTo,
} from '../utils';
import {Knot} from './Knot';
import {BBox, SerializedVector2, Vector2} from '@motion-canvas/core/lib/types';
import {DesiredLength} from '../partials';
import splineWithInsufficientKnots from './__logs__/spline-with-insufficient-knots.md';
import {BezierSegment} from '../curves/BezierSegment';

export interface SplineProps extends LineProps {
  /**
   * {@inheritDoc Spline.smoothness}
   */
  smoothness?: SignalValue<number>;
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
export class Spline extends Line {
  /**
   * Determine the smoothness of the spline when using auto-calculated handles.
   *
   * @remarks
   * This property is only applied to knots that don't use explicit handles.
   *
   * @defaultValue 0.4
   */
  @initial(0.4)
  @signal()
  public declare readonly smoothness: SimpleSignal<number>;

  public constructor(props: SplineProps) {
    super(props);
  }

  public override profile(): CurveProfile {
    return getBezierSplineProfile(
      this.knots(),
      this.closed(),
      this.smoothness(),
    );
  }

  @computed()
  public knots(): KnotInfo[] {
    if (this.points()) {
      return this.parsedPoints().map(point => ({
        position: point,
        startHandle: point,
        endHandle: point,
        auto: {start: 1, end: 1},
      }));
    }

    return this.children()
      .filter(this.isKnot)
      .map(knot => knot.points());
  }

  protected override childrenBBox() {
    const points = (this.profile().segments as BezierSegment[]).flatMap(
      segment => segment.points,
    );
    return BBox.fromPoints(...points);
  }

  protected override validateProps(props: SplineProps) {
    if (
      (props.children === undefined || props.children.length < 2) &&
      (props.points === undefined || props.points.length < 2) &&
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

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    const points = (this.profile().segments as BezierSegment[]).flatMap(
      segment => segment.points,
    );
    return BBox.fromPoints(...points);
  }

  public override drawOverlay(
    context: CanvasRenderingContext2D,
    matrix: DOMMatrix,
  ) {
    const size = this.computedSize();
    const box = this.cacheBBox().transformCorners(matrix);
    const offset = size.mul(this.offset()).scale(0.5).transformAsPoint(matrix);
    const segments = this.profile().segments as BezierSegment[];

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
    const radius = 8;
    context.beginPath();
    lineTo(context, offset.addY(-radius));
    lineTo(context, offset.addY(radius));
    lineTo(context, offset);
    lineTo(context, offset.addX(-radius));
    context.arc(offset.x, offset.y, radius, 0, Math.PI * 2);
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
