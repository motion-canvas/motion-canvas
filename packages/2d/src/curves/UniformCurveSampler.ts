import {map, remap} from '@motion-canvas/core/lib/tweening';
import {Vector2} from '@motion-canvas/core/lib/types';
import {PolynomialSegment} from './PolynomialSegment';

export interface SampledPoint {
  t: number;
  position: Vector2;
  distance: number;
  tangent: Vector2;
  previous?: SampledPoint;
  next?: SampledPoint;
}

/**
 * Class to uniformly sample points on a given curve.
 *
 * @remarks
 * In order to uniformly sample points from non-linear curves, this sampler
 * re-parameterizes the curve by arclength.
 */
export class UniformCurveSampler {
  private sampledPoints: SampledPoint[] = [];

  /**
   * @param curve - The curve to sample
   * @param samples - How many points to sample from the provided curve. The
   *                  more points get sampled, the higher the resolution–and
   *                  therefore precision–of the sampler.
   */
  public constructor(private readonly curve: PolynomialSegment, samples = 20) {
    this.resample(samples);
  }

  /**
   * Discard all previously sampled points and resample the provided number of
   * points from the curve.
   *
   * @param samples - The number of points to sample.
   */
  public resample(samples: number): void {
    this.sampledPoints = [
      {
        t: 0,
        distance: 0,
        ...this.curve.eval(0),
      },
    ];

    let length = 0;
    for (let i = 1; i < samples; i++) {
      const t = i / (samples - 1);
      const previous = this.sampledPoints[i - 1];
      const curvePoint = this.curve.eval(t);
      const segmentLength = previous.position.sub(
        curvePoint.position,
      ).magnitude;

      length += segmentLength;

      const point: SampledPoint = {
        t,
        distance: length,
        ...curvePoint,
        previous,
      };

      previous.next = point;
      this.sampledPoints.push(point);
    }

    // Account for any accumulated floating point errors and explicitly set the
    // distance of the last point to the arclength of the curve.
    this.sampledPoints.at(-1)!.distance = this.curve.arcLength;
  }

  /**
   * Return the point at the provided distance along the curve's arclength.
   *
   * @remarks
   * This method approximates the desired point by finding the two sampled
   * points that are closest to the provided distance. It then calculates the
   * final position by interpolating the two sampled points' positions across
   * the remaining distance.
   *
   * @param distance - The distance along the curve's arclength for which to
   *                   retrieve the point.
   */
  public pointAtDistance(distance: number): SampledPoint {
    const length = this.curve.arcLength;

    if (distance < 0) {
      return this.sampledPoints.at(0)!;
    } else if (distance > length) {
      return this.sampledPoints.at(-1)!;
    }

    const snappedPoint: SampledPoint = this.sampledPoints.find(
      point => point.distance >= distance,
    )!;

    let lowerPoint: SampledPoint;
    let upperPoint: SampledPoint;

    if (!snappedPoint.previous) {
      // No previous point means we snapped to the first sampled point
      lowerPoint = snappedPoint;
      upperPoint = snappedPoint.next!;
    } else if (!snappedPoint.next) {
      // No next point means we snapped to the last sampled point
      lowerPoint = snappedPoint.previous;
      upperPoint = snappedPoint;
    } else {
      // Otherwise, we need to figure out if the original distance is closer to
      // the snapped points previous or next point.
      const distanceToNext = snappedPoint.next.distance - distance;
      const distanceToPrevious = distance - snappedPoint.previous.distance;

      if (distanceToNext < distanceToPrevious) {
        upperPoint = snappedPoint.next;
        lowerPoint = snappedPoint;
      } else {
        upperPoint = snappedPoint;
        lowerPoint = snappedPoint.previous;
      }
    }

    const distanceT = remap(
      lowerPoint.distance,
      upperPoint.distance,
      0,
      1,
      distance,
    );
    const t = map(lowerPoint.t, upperPoint.t, distanceT);
    const curvePoint = this.curve.eval(t);

    return {
      ...curvePoint,
      distance,
      t,
    };
  }
}
