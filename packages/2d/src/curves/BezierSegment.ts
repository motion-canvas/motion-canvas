import {Segment} from './Segment';
import {Vector2} from '@motion-canvas/core/lib/types';
import {UniformCurveSampler} from './UniformCurveSampler';
import {moveTo} from '../utils';
import {Polynomial2D} from './Polynomial2D';
import {CurvePoint} from './CurvePoint';

export abstract class BezierSegment extends Segment {
  protected readonly pointSampler: UniformCurveSampler;

  public get arcLength(): number {
    return this.length;
  }

  public abstract get points(): Vector2[];

  protected constructor(
    protected readonly curve: Polynomial2D,
    protected readonly length: number,
  ) {
    super();
    this.pointSampler = new UniformCurveSampler(this);
  }

  /**
   * Evaluate the Bézier at the given t value.
   *
   * @param t - The t value at which to evaluate the curve.
   */
  public eval(t: number): CurvePoint {
    return {
      position: this.curve.eval(t),
      tangent: this.tangent(t),
    };
  }

  /**
   * Split the curve into two separate cubic Bézier curves at the given t value.
   * The two resulting curves form the same overall shape as the original curve.
   *
   * @param t - The t value at which to split the curve.
   */
  public abstract split(t: number): [BezierSegment, BezierSegment];

  public getPoint(distance: number): [Vector2, Vector2] {
    const closestPoint = this.pointSampler.pointAtDistance(distance);
    return [closestPoint.position, closestPoint.tangent];
  }

  public transformPoints(matrix: DOMMatrix): Vector2[] {
    return this.points.map(point => point.transformAsPoint(matrix));
  }

  /**
   * Evaluate the Bézier at the given t value.
   *
   * @param t - The t value at which to evaluate the curve.
   */
  public tangent(t: number): Vector2 {
    return this.curve.evalDerivative(t).normalized;
  }

  public draw(
    context: CanvasRenderingContext2D | Path2D,
    start = 0,
    end = 1,
    move = true,
  ): [Vector2, Vector2, Vector2, Vector2] {
    let curve: BezierSegment | null = null;
    let startT = start;
    let endT = end;
    let points = this.points;

    if (start !== 0 || end !== 1) {
      const startDistance = this.length * start;
      const endDistance = this.length * end;
      const startPoint = this.pointSampler.pointAtDistance(startDistance);
      const endPoint = this.pointSampler.pointAtDistance(endDistance);
      const endPointT = (endPoint.t - startPoint.t) / (1 - startPoint.t);

      const [, startSegment] = this.split(startPoint.t);
      [curve] = startSegment.split(endPointT);
      points = curve.points;
      startT = startPoint.t;
      endT = endPoint.t;
    }

    if (move) {
      moveTo(context, points[0]);
    }
    (curve ?? this).doDraw(context);

    return [
      points[0],
      this.tangent(startT),
      points.at(-1)!,
      this.tangent(endT),
    ];
  }

  protected abstract doDraw(context: CanvasRenderingContext2D | Path2D): void;
}
