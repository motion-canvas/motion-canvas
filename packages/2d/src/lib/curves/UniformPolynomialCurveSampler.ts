import {Vector2, clamp, remap} from '@motion-canvas/core';
import {CurvePoint} from './CurvePoint';
import {PolynomialSegment} from './PolynomialSegment';

/**
 * Class to uniformly sample points on a given polynomial curve.
 *
 * @remarks
 * In order to uniformly sample points from non-linear curves, this sampler
 * re-parameterizes the curve by arclength.
 */
export class UniformPolynomialCurveSampler {
  private sampledDistances: number[] = [];

  /**
   * @param curve - The curve to sample
   * @param samples - How many points to sample from the provided curve. The
   *                  more points get sampled, the higher the resolution–and
   *                  therefore precision–of the sampler.
   */
  public constructor(
    private readonly curve: PolynomialSegment,
    samples = 20,
  ) {
    this.resample(samples);
  }

  /**
   * Discard all previously sampled points and resample the provided number of
   * points from the curve.
   *
   * @param samples - The number of points to sample.
   */
  public resample(samples: number): void {
    this.sampledDistances = [0];

    let length = 0;
    let previous: Vector2 = this.curve.eval(0).position;
    for (let i = 1; i < samples; i++) {
      const t = i / (samples - 1);
      const curvePoint = this.curve.eval(t);
      const segmentLength = previous.sub(curvePoint.position).magnitude;

      length += segmentLength;

      this.sampledDistances.push(length);
      previous = curvePoint.position;
    }

    // Account for any accumulated floating point errors and explicitly set the
    // distance of the last point to the arclength of the curve.
    this.sampledDistances[this.sampledDistances.length - 1] =
      this.curve.arcLength;
  }

  /**
   * Return the point at the provided distance along the sampled curve's
   * arclength.
   *
   * @param distance - The distance along the curve's arclength for which to
   *                   retrieve the point.
   */
  public pointAtDistance(distance: number): CurvePoint {
    return this.curve.eval(this.distanceToT(distance));
  }

  /**
   * Return the t value for the point at the provided distance along the sampled
   * curve's arc length.
   *
   * @param distance - The distance along the arclength
   */
  public distanceToT(distance: number): number {
    const samples = this.sampledDistances.length;
    distance = clamp(0, this.curve.arcLength, distance);

    for (let i = 0; i < samples; i++) {
      const lower = this.sampledDistances[i];
      const upper = this.sampledDistances[i + 1];
      if (distance >= lower && distance <= upper) {
        return remap(
          lower,
          upper,
          i / (samples - 1),
          (i + 1) / (samples - 1),
          distance,
        );
      }
    }

    return 1;
  }
}
