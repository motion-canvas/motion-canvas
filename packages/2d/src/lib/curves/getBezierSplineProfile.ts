import {Vector2, clamp} from '@motion-canvas/core';
import {CubicBezierSegment} from './CubicBezierSegment';
import {CurveProfile} from './CurveProfile';
import {KnotInfo} from './KnotInfo';
import {PolynomialSegment} from './PolynomialSegment';
import {QuadBezierSegment} from './QuadBezierSegment';

function isCubicSegment(
  segment: PolynomialSegment,
): segment is CubicBezierSegment {
  return segment instanceof CubicBezierSegment;
}

/**
 * Update a given knot's handles to be a blend between the user provided handles
 * and a set of auto calculated handles that smoothly connect the knot to its
 * two neighboring knots.
 *
 * @param knot - The knot for which to calculate the handles
 * @param previous - The previous knot in the spline, relative to the provided
 *                   knot.
 * @param next - The next knot in the spline, relative to the provided knot.
 * @param smoothness - The desired smoothness of the spline. Affects the scaling
 *                     of the auto calculated handles.
 */
function calculateSmoothHandles(
  knot: KnotInfo,
  previous: KnotInfo,
  next: KnotInfo,
  smoothness: number,
) {
  if (knot.auto.start === 0 && knot.auto.end === 0) {
    return;
  }

  // See for reference:
  // http://scaledinnovation.com/analytics/splines/aboutSplines.html
  const distanceToPrev = knot.position.sub(previous.position).magnitude;
  const distanceToNext = next.position.sub(knot.position).magnitude;
  const fa = (smoothness * distanceToPrev) / (distanceToPrev + distanceToNext);
  const fb = smoothness - fa;
  const startHandle = new Vector2(
    knot.position.x - fa * (next.position.x - previous.position.x),
    knot.position.y - fa * (next.position.y - previous.position.y),
  );
  const endHandle = new Vector2(
    knot.position.x + fb * (next.position.x - previous.position.x),
    knot.position.y + fb * (next.position.y - previous.position.y),
  );

  knot.startHandle = knot.startHandle.lerp(startHandle, knot.auto.start);
  knot.endHandle = knot.endHandle.lerp(endHandle, knot.auto.end);
}

/**
 * Calculate the `minSin` value of the curve profile so that miter joins get
 * taken into account properly.
 */
function updateMinSin(profile: CurveProfile) {
  for (let i = 0; i < profile.segments.length; i++) {
    const segmentA = profile.segments[i] as PolynomialSegment;
    const segmentB = profile.segments[
      (i + 1) % profile.segments.length
    ] as PolynomialSegment;

    // Quadratic Bézier segments will always join smoothly with the previous
    // segment. This means that we can skip the segment since it's impossible
    // to have a miter join between the two segments.
    if (!isCubicSegment(segmentA) || !isCubicSegment(segmentB)) {
      continue;
    }

    const startVector = segmentA.p2.sub(segmentA.p3).normalized.safe;
    const endVector = segmentB.p1.sub(segmentB.p0).normalized.safe;
    const dot = startVector.dot(endVector);

    // A miter join can only occur if the handle is broken, so we can skip the
    // segment if the handles are mirrored.
    const isBroken = 1 - Math.abs(dot) > 0.0001;
    if (!isBroken) {
      continue;
    }

    const angleBetween = Math.acos(clamp(-1, 1, dot));
    const angleSin = Math.sin(angleBetween / 2);

    profile.minSin = Math.min(profile.minSin, Math.abs(angleSin));
  }
}

function addSegmentToProfile(
  profile: CurveProfile,
  p0: Vector2,
  p1: Vector2,
  p2: Vector2,
  p3?: Vector2,
) {
  const segment =
    p3 !== undefined
      ? new CubicBezierSegment(p0, p1, p2, p3)
      : new QuadBezierSegment(p0, p1, p2);
  profile.segments.push(segment);
  profile.arcLength += segment.arcLength;
}

/**
 * Calculate the curve profile of a spline based on a set of knots.
 *
 * @param knots - The knots defining the spline
 * @param closed - Whether the spline should be closed or not
 * @param smoothness - The desired smoothness of the spline when using auto
 *                     calculated handles.
 */
export function getBezierSplineProfile(
  knots: KnotInfo[],
  closed: boolean,
  smoothness: number,
): CurveProfile {
  const profile: CurveProfile = {
    segments: [],
    arcLength: 0,
    minSin: 1,
  };

  if (knots.length < 2) {
    return profile;
  }

  // First, we want to calculate the actual handle positions for each knot. We
  // do so using the knot's `auto` value to blend between the user-provided
  // handles and the auto calculated smooth handles.
  const numberOfKnots = knots.length;
  for (let i = 0; i < numberOfKnots; i++) {
    // Calculating the auto handles for a given knot requires both of the knot's
    // neighboring knots. To make sure that this works properly for the first
    // and last knots of the spline, we want to make sure to wrap around to the
    // beginning and end of the array, respectively.
    const prevIndex = (i - 1 + numberOfKnots) % numberOfKnots;
    const nextIndex = (i + 1) % numberOfKnots;
    calculateSmoothHandles(
      knots[i],
      knots[prevIndex],
      knots[nextIndex],
      smoothness,
    );
  }

  const firstKnot = knots[0];
  const secondKnot = knots[1];

  // Drawing the first and last segments of a spline has a few edge cases we
  // need to consider:
  // If the spline is not closed and the first knot should use the auto
  // calculated handles, we want to draw a quadratic Bézier curve instead of a
  // cubic one.
  if (!closed && firstKnot.auto.start === 1 && firstKnot.auto.end === 1) {
    addSegmentToProfile(
      profile,
      firstKnot.position,
      secondKnot.startHandle,
      secondKnot.position,
    );
  } else {
    // Otherwise, draw a cubic Bézier segment like we do for the other segments.
    addSegmentToProfile(
      profile,
      firstKnot.position,
      firstKnot.endHandle,
      secondKnot.startHandle,
      secondKnot.position,
    );
  }

  // Add all intermediate spline segments as cubic Bézier curve segments.
  for (let i = 1; i < numberOfKnots - 2; i++) {
    const start = knots[i];
    const end = knots[i + 1];
    addSegmentToProfile(
      profile,
      start.position,
      start.endHandle,
      end.startHandle,
      end.position,
    );
  }

  const lastKnot = knots.at(-1)!;
  const secondToLastKnot = knots.at(-2)!;

  if (knots.length > 2) {
    // Similar to the first segment, we also want to draw the last segment as a
    // quadratic Bézier curve if the curve is not closed and the knot should
    // use the auto calculated handles.
    if (!closed && lastKnot.auto.start === 1 && lastKnot.auto.end === 1) {
      addSegmentToProfile(
        profile,
        secondToLastKnot.position,
        secondToLastKnot.endHandle,
        lastKnot.position,
      );
    } else {
      addSegmentToProfile(
        profile,
        secondToLastKnot.position,
        secondToLastKnot.endHandle,
        lastKnot.startHandle,
        lastKnot.position,
      );
    }
  }

  // If the spline should be closed, add one final cubic Bézier segment
  // connecting the last and first knots.
  if (closed) {
    addSegmentToProfile(
      profile,
      lastKnot.position,
      lastKnot.endHandle,
      firstKnot.startHandle,
      firstKnot.position,
    );
  }

  updateMinSin(profile);

  return profile;
}
