import {
  BBox,
  createSignal,
  PossibleVector2,
  SignalValue,
  SimpleSignal,
  threadable,
  ThreadGenerator,
  TimingFunction,
  tween,
  unwrap,
  useLogger,
  Vector2,
} from '@motion-canvas/core';
import {CurveProfile, getPolylineProfile} from '../curves';
import {
  calculateLerpDistance,
  polygonLength,
  polygonPointsLerp,
} from '../curves/createCurveProfileLerp';
import {computed, initial, nodeName, signal} from '../decorators';
import {arc, drawLine, drawPivot, lineTo, moveTo} from '../utils';
import lineWithoutPoints from './__logs__/line-without-points.md';
import {Curve, CurveProps} from './Curve';
import {Layout} from './Layout';

export interface LineProps extends CurveProps {
  /**
   * {@inheritDoc Line.radius}
   */
  radius?: SignalValue<number>;
  /**
   * {@inheritDoc Line.points}
   */
  points?: SignalValue<SignalValue<PossibleVector2>[]>;
}

/**
 * A node for drawing lines and polygons.
 *
 * @remarks
 * This node can be used to render any polygonal shape defined by a set of
 * points.
 *
 * @preview
 * ```tsx editor
 * // snippet Simple line
 * import {makeScene2D, Line} from '@motion-canvas/2d';
 *
 * export default makeScene2D(function* (view) {
 *   view.add(
 *     <Line
 *       points={[
 *         [150, 50],
 *         [0, -50],
 *         [-150, 50],
 *       ]}
 *       stroke={'lightseagreen'}
 *       lineWidth={8}
 *       radius={40}
 *       startArrow
 *     />,
 *   );
 * });
 *
 * // snippet Polygon
 * import {makeScene2D, Line} from '@motion-canvas/2d';
 *
 * export default makeScene2D(function* (view) {
 *   view.add(
 *     <Line
 *       points={[
 *         [-200, 70],
 *         [150, 70],
 *         [100, -70],
 *         [-100, -70],
 *       ]}
 *       fill={'lightseagreen'}
 *       closed
 *     />,
 *   );
 * });
 *
 * // snippet Using signals
 * import {makeScene2D, Line} from '@motion-canvas/2d';
 * import {createSignal} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const tip = createSignal(-150);
 *   view.add(
 *     <Line
 *       points={[
 *         [-150, 70],
 *         [150, 70],
 *         // this point is dynamically calculated based on the signal:
 *         () => [tip(), -70],
 *       ]}
 *       stroke={'lightseagreen'}
 *       lineWidth={8}
 *       closed
 *     />,
 *   );
 *
 *   yield* tip(150, 1).back(1);
 * });
 *
 * // snippet Tweening points
 * import {makeScene2D, Line} from '@motion-canvas/2d';
 * import {createRef} from '@motion-canvas/core';
 *
 * export default makeScene2D(function* (view) {
 *   const line = createRef<Line>();
 *   view.add(
 *     <Line
 *       ref={line}
 *       points={[
 *         [-150, 70],
 *         [150, 70],
 *         [0, -70],
 *       ]}
 *       stroke={'lightseagreen'}
 *       lineWidth={8}
 *       radius={20}
 *       closed
 *     />,
 *   );
 *
 *   yield* line()
 *     .points(
 *       [
 *         [-150, 0],
 *         [0, 100],
 *         [150, 0],
 *         [150, -70],
 *         [-150, -70],
 *       ],
 *       2,
 *     )
 *     .back(2);
 * });
 * ```
 */
@nodeName('Line')
export class Line extends Curve {
  /**
   * Rotate the points to minimize the overall distance traveled when tweening.
   *
   * @param points - The points to rotate.
   * @param reference - The reference points to which the distance is measured.
   * @param closed - Whether the points form a closed polygon.
   */
  private static rotatePoints(
    points: Vector2[],
    reference: Vector2[],
    closed: boolean,
  ) {
    if (closed) {
      let minDistance = Infinity;
      let bestOffset = 0;
      for (let offset = 0; offset < points.length; offset += 1) {
        const distance = calculateLerpDistance(points, reference, offset);
        if (distance < minDistance) {
          minDistance = distance;
          bestOffset = offset;
        }
      }

      if (bestOffset) {
        const spliced = points.splice(0, bestOffset);
        points.splice(points.length, 0, ...spliced);
      }
    } else {
      const originalDistance = calculateLerpDistance(points, reference, 0);
      const reversedPoints = [...points].reverse();
      const reversedDistance = calculateLerpDistance(
        reversedPoints,
        reference,
        0,
      );
      if (reversedDistance < originalDistance) {
        points.reverse();
      }
    }
  }

  /**
   * Distribute additional points along the polyline.
   *
   * @param points - The points of a polyline along which new points should be
   *                 distributed.
   * @param count - The number of points to add.
   */
  private static distributePoints(points: Vector2[], count: number) {
    if (points.length === 0) {
      for (let j = 0; j < count; j++) {
        points.push(Vector2.zero);
      }
      return;
    }

    if (points.length === 1) {
      const point = points[0];
      for (let j = 0; j < count; j++) {
        points.push(point);
      }
      return;
    }

    const desiredLength = points.length + count;
    const arcLength = polygonLength(points);
    let density = arcLength === 0 ? 0 : count / arcLength;

    let i = 0;
    while (points.length < desiredLength) {
      const pointsLeft = desiredLength - points.length;

      if (i + 1 >= points.length) {
        density = arcLength === 0 ? 0 : pointsLeft / arcLength;
        i = 0;
        continue;
      }

      const a = points[i];
      const b = points[i + 1];
      const length = a.sub(b).magnitude;
      let pointCount = Math.min(Math.round(length * density), pointsLeft) + 1;

      if (arcLength === 0) {
        pointCount = 2;
      }

      for (let j = 1; j < pointCount; j++) {
        points.splice(++i, 0, Vector2.lerp(a, b, j / pointCount));
      }

      i++;
    }
  }

  /**
   * The radius of the line's corners.
   */
  @initial(0)
  @signal()
  public declare readonly radius: SimpleSignal<number, this>;

  /**
   * The points of the line.
   *
   * @remarks
   * When set to `null`, the Line will use the positions of its children as
   * points.
   */
  @initial(null)
  @signal()
  public declare readonly points: SimpleSignal<
    SignalValue<PossibleVector2>[] | null,
    this
  >;

  @threadable()
  protected *tweenPoints(
    value: SignalValue<SignalValue<PossibleVector2>[] | null>,
    time: number,
    timingFunction: TimingFunction,
  ): ThreadGenerator {
    const fromPoints = [...this.parsedPoints()];
    const toPoints = this.parsePoints(unwrap(value));
    const closed = this.closed();

    const diff = fromPoints.length - toPoints.length;
    Line.distributePoints(diff < 0 ? fromPoints : toPoints, Math.abs(diff));
    Line.rotatePoints(toPoints, fromPoints, closed);

    this.tweenedPoints(fromPoints);
    yield* tween(
      time,
      value => {
        const progress = timingFunction(value);
        this.tweenedPoints(polygonPointsLerp(fromPoints, toPoints, progress));
      },
      () => {
        this.tweenedPoints(null);
        this.points(value);
      },
    );
  }

  private tweenedPoints = createSignal<Vector2[] | null>(null);

  public constructor(props: LineProps) {
    super(props);

    if (props.children === undefined && props.points === undefined) {
      useLogger().warn({
        message: 'No points specified for the line',
        remarks: lineWithoutPoints,
        inspect: this.key,
      });
    }
  }

  @computed()
  protected childrenBBox() {
    let points = this.tweenedPoints();
    if (!points) {
      const custom = this.points();
      points = custom
        ? custom.map(signal => new Vector2(unwrap(signal)))
        : this.children()
            .filter(child => !(child instanceof Layout) || child.isLayoutRoot())
            .map(child => child.position());
    }

    return BBox.fromPoints(...points);
  }

  @computed()
  public parsedPoints(): Vector2[] {
    return this.parsePoints(this.points());
  }

  @computed()
  public override profile(): CurveProfile {
    return getPolylineProfile(
      this.tweenedPoints() ?? this.parsedPoints(),
      this.radius(),
      this.closed(),
    );
  }

  protected override lineWidthCoefficient(): number {
    const radius = this.radius();
    const join = this.lineJoin();

    let coefficient = super.lineWidthCoefficient();

    if (radius === 0 && join === 'miter') {
      const {minSin} = this.profile();
      if (minSin > 0) {
        coefficient = Math.max(coefficient, 0.5 / minSin);
      }
    }

    return coefficient;
  }

  public override drawOverlay(
    context: CanvasRenderingContext2D,
    matrix: DOMMatrix,
  ) {
    const box = this.childrenBBox().transformCorners(matrix);
    const size = this.computedSize();
    const offset = size.mul(this.offset()).scale(0.5).transformAsPoint(matrix);

    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 1;

    const path = new Path2D();
    const points = (this.tweenedPoints() ?? this.parsedPoints()).map(point =>
      point.transformAsPoint(matrix),
    );
    if (points.length > 0) {
      moveTo(path, points[0]);
      for (const point of points) {
        lineTo(path, point);
        context.beginPath();
        arc(context, point, 4);
        context.closePath();
        context.fill();
        context.stroke();
      }
    }

    context.strokeStyle = 'white';
    context.stroke(path);

    context.beginPath();
    drawPivot(context, offset);
    context.stroke();

    context.beginPath();
    drawLine(context, box);
    context.closePath();
    context.stroke();
  }

  private parsePoints(points: SignalValue<PossibleVector2>[] | null) {
    return points
      ? points.map(signal => new Vector2(unwrap(signal)))
      : this.children().map(child => child.position());
  }
}
