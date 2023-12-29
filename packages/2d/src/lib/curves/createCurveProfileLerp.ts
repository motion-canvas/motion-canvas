import {Vector2} from '@motion-canvas/core';
import {CurveProfile} from './CurveProfile';
import {LineSegment} from './LineSegment';
import {getPointAtDistance} from './getPointAtDistance';
import {getPolylineProfile} from './getPolylineProfile';

// Based on kute.js svgMorph plugin

interface SubcurveProfile extends CurveProfile {
  closed: boolean;
}

interface PolygonProfile {
  /**
   * If path closed, first point and last point must be equal
   */
  points: Vector2[];
  closed: boolean;
}

/**
 * Split segments of polygon until distance between adjacent point is less than or equal maxLength. This function mutate original points.
 * @param points - Polygon points
 * @param maxLength - max distance between two point
 */

function bisect(points: Vector2[], maxLength: number) {
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    let b = points[i + 1];
    while (a.sub(b).magnitude > maxLength) {
      b = Vector2.lerp(a, b, 0.5);
      points.splice(i + 1, 0, b);
    }
  }
}

/**
 * Convert curve which only contain LineSegment into polygon.
 * @param curve - curve to convert. curve must contain 1 subpath
 * @param maxLength - max distance between two point
 * @returns - null if curve contain segment other than LineSegment
 */

function exactPolygonPoints(
  curve: SubcurveProfile,
  maxLength: number,
): Vector2[] | null {
  const points: Vector2[] = [];

  let endPoint: Vector2 | null = null;
  for (const segment of curve.segments) {
    if (!(segment instanceof LineSegment)) return null;

    points.push(segment.from);

    endPoint = segment.to;
  }

  if (endPoint) points.push(endPoint);

  if (!Number.isNaN(maxLength) && maxLength > 0) {
    bisect(points, maxLength);
  }

  return points;
}

/**
 * Calculate area of polygon
 * @param points - polygon points
 * @returns - area of polygon
 */

function polygonArea(points: Vector2[]) {
  return (
    points.reduce((area, a, i) => {
      const b = points[(i + 1) % points.length];
      return area + (a.y * b.x - a.x * b.y);
    }, 0) / 2
  );
}

/**
 * Convert curve into polygon by sampling curve profile
 * @param curve - curve to convert. curve must contain only 1 subpath
 * @param maxLength - max distance between point
 * @returns - always return polygon points
 */

function approximatePolygonPoints(
  curve: SubcurveProfile,
  maxLength: number,
): Vector2[] {
  const points: Vector2[] = [];

  let numPoints = 3;
  if (!Number.isNaN(maxLength) && maxLength > 0) {
    numPoints = Math.max(numPoints, Math.ceil(curve.arcLength / maxLength));
  }

  for (let i = 0; i < numPoints; i += 1) {
    const point = getPointAtDistance(
      curve,
      curve.arcLength * (i / (numPoints - 1)),
    );
    points.push(point.position);
  }

  if (polygonArea(points) > 0) points.reverse();

  return points;
}

/**
 * Split curve into subpaths
 * @param curve - curve to split
 * @returns - subpaths of curve
 */

function splitCurve(curve: CurveProfile) {
  if (curve.segments.length === 0) return [];

  let current: SubcurveProfile = {
    arcLength: 0,
    minSin: 0,
    segments: [],
    closed: false,
  };

  let endPoint: Vector2 | null = null;

  const composite: SubcurveProfile[] = [current];

  for (const segment of curve.segments) {
    const start = segment.getPoint(0).position;

    if (endPoint && !start.equals(endPoint)) {
      current = {
        arcLength: 0,
        minSin: 0,
        segments: [],
        closed: false,
      };
      composite.push(current);
    }

    current.segments.push(segment);
    current.arcLength += segment.arcLength;
    endPoint = segment.getPoint(1).position;
  }

  for (const sub of composite) {
    sub.closed = sub.segments[0]
      .getPoint(0)
      .position.equals(
        sub.segments[sub.segments.length - 1].getPoint(1).position,
      );
  }

  return composite;
}

/**
 * Convert curve into polygon use best possible method
 * @param curve - curve to convert
 * @param maxLength - max distance between two point
 * @returns - polgon points
 */

function subcurveToPolygon(
  curve: SubcurveProfile,
  maxLength: number,
): PolygonProfile {
  const points =
    exactPolygonPoints(curve, maxLength) ||
    approximatePolygonPoints(curve, maxLength);
  return {
    points: [...points],
    closed: curve.closed,
  };
}

/**
 * Calculate polygon perimeter
 * @param points - polygon points
 * @returns - perimeter of polygon
 */

export function polygonLength(points: Vector2[]) {
  return points.reduce((length, point, i) => {
    if (i) return length + points[i - 1].sub(point).magnitude;
    return 0;
  }, 0);
}

/**s
 * Sample additional points for polygon to better match its pair. This will mutate original points.
 * @param points - polygon points
 * @param numPoints - number of points to be added
 */

function addPoints(points: Vector2[], numPoints: number) {
  const desiredLength = points.length + numPoints;
  const step = polygonLength(points) / numPoints;

  let i = 0;
  let cursor = 0;
  let insertAt = step / 2;

  while (points.length < desiredLength) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const length = a.sub(b).magnitude;

    if (insertAt <= cursor + length) {
      points.splice(
        i + 1,
        0,
        length
          ? Vector2.lerp(a, b, (insertAt - cursor) / length)
          : new Vector2(a),
      );
      insertAt += step;
    } else {
      cursor += length;
      i += 1;
    }
  }
}

/**
 * Calculate total moving point distance when morphing between polygon points
 * @param points - first polygon points
 * @param reference - second polygon points
 * @param offset - offset for first polygon points
 * @returns
 */

export function calculateLerpDistance(
  points: Vector2[],
  reference: Vector2[],
  offset: number,
) {
  const len = points.length;
  let sumOfSquares = 0;

  for (let i = 0; i < reference.length; i += 1) {
    const a = points[(offset + i) % len];
    const b = reference[i];
    sumOfSquares += a.sub(b).squaredMagnitude;
  }

  return sumOfSquares;
}

/**
 * Rotate polygon in order to minimize moving points.
 * @param polygon - polygon to be rotated
 * @param reference - polygon to be reference
 */

function rotatePolygon(polygon: PolygonProfile, reference: PolygonProfile) {
  const {points, closed} = polygon;
  const len = points.length;

  if (!closed) {
    const originalDistance = calculateLerpDistance(points, reference.points, 0);
    const reversedPoints = [...points].reverse();
    const reversedDistance = calculateLerpDistance(
      reversedPoints,
      reference.points,
      0,
    );
    if (reversedDistance < originalDistance) polygon.points = reversedPoints;
  } else {
    let minDistance = Infinity;
    let bestOffset = 0;
    const last = points.pop();

    // Closed polygon first point must equal last point
    // When we rotate polygon, first point is changed which mean last point also must changed
    // When we remove last point, calculateLerpDistance will assume last point is equal first point
    // Proof:
    // len = points.length = reference.length - 1
    // When i = 0:
    // (offset + i) % len = offset % len
    // When i = reference.length - 1 or i = len
    // (offset + i) % len = (offset + len) % len = offset % len

    for (let offset = 0; offset < len; offset += 1) {
      const distance = calculateLerpDistance(points, reference.points, offset);
      if (distance < minDistance) {
        minDistance = distance;
        bestOffset = offset;
      }
    }

    if (last) points.push(last);

    if (bestOffset) {
      points.pop();
      const spliced = points.splice(0, bestOffset);
      points.splice(points.length, 0, ...spliced);
      points.push(points[0]);
    }
  }
}

/**
 * Round polygon's points coordinate to a specified amount of decimal
 * @param points - polygon point to be rounded
 * @param round - amount of decimal
 * @returns - new polygon point
 */

function roundPolygon(
  {points, ...rest}: PolygonProfile,
  round: number,
): PolygonProfile {
  const pow = round >= 1 ? 10 ** round : 1;
  return {
    points: points.map(point => {
      const [x, y] = [point.x, point.y].map(n => Math.round(n * pow) / pow);
      return new Vector2(x, y);
    }),
    ...rest,
  };
}

/**
 * Create two polygon to tween between sub curve/path
 * @param from - source curve
 * @param to - targe curve
 * @param precision - desired distance between two point
 * @param round - amount of decimal when rounding
 * @returns two polygon ready to tween
 */

function getSubcurveInterpolationPolygon(
  from: SubcurveProfile,
  to: SubcurveProfile,
  precision: number,
  round: number,
) {
  const morphPrecision = precision;
  const fromRing = subcurveToPolygon(from, morphPrecision);
  const toRing = subcurveToPolygon(to, morphPrecision);

  const diff = fromRing.points.length - toRing.points.length;

  addPoints(fromRing.points, diff < 0 ? diff * -1 : 0);
  addPoints(toRing.points, diff > 0 ? diff : 0);

  if (!from.closed && to.closed) rotatePolygon(toRing, fromRing);
  else rotatePolygon(fromRing, toRing);

  return {
    from: roundPolygon(fromRing, round),
    to: roundPolygon(toRing, round),
  };
}

/**
 * Make two sub curve list have equal length
 * @param subcurves - List to add
 * @param reference - Reference list
 */

function balanceSubcurves(
  subcurves: SubcurveProfile[],
  reference: SubcurveProfile[],
) {
  for (let i = subcurves.length; i < reference.length; i++) {
    const point = reference[i].segments[0].getPoint(0).position;
    subcurves.push({
      arcLength: 0,
      closed: false,
      minSin: 0,
      segments: [new LineSegment(point, point)],
    });
  }
}

/**
 * Create two polygon to tween between curve
 * @param from - source curve
 * @param to - targe curve
 * @param precision - desired distance between two point
 * @param round - amount of decimal when rounding
 * @returns list that contain list of polygon before and after tween
 */

function getInterpolationPolygon(
  from: CurveProfile,
  to: CurveProfile,
  precision: number,
  round: number,
) {
  const fromSub = splitCurve(from);
  const toSub = splitCurve(to);

  if (fromSub.length < toSub.length) balanceSubcurves(fromSub, toSub);
  else balanceSubcurves(toSub, fromSub);

  return fromSub.map((sub, i) =>
    getSubcurveInterpolationPolygon(sub, toSub[i], precision, round),
  );
}

/**
 * Add curve into another curve
 * @param target - target curve
 * @param source - curve to add
 */

function addCurveToCurve(target: CurveProfile, source: CurveProfile) {
  const {segments, arcLength, minSin} = source;
  target.segments.push(...segments);
  target.arcLength += arcLength;
  target.minSin = Math.min(target.minSin, minSin);
}

/**
 * Interpolate between two polygon points.
 * @param from - source polygon points
 * @param to - target polygon points
 * @param value - interpolation progress
 * @returns - new polygon points
 */

export function polygonPointsLerp(
  from: Vector2[],
  to: Vector2[],
  value: number,
): Vector2[] {
  const points: Vector2[] = [];
  if (value === 0) return [...from];
  if (value === 1) return [...to];

  for (let i = 0; i < from.length; i++) {
    const a = from[i];
    const b = to[i];
    points.push(Vector2.lerp(a, b, value));
  }
  return points;
}

/**
 * Create interpolator to tween between two curve
 * @param a - source curve
 * @param b - target curve
 * @returns - curve interpolator
 */

export function createCurveProfileLerp(a: CurveProfile, b: CurveProfile) {
  const interpolations = getInterpolationPolygon(a, b, 5, 4);

  return (progress: number) => {
    const curve: CurveProfile = {
      segments: [],
      arcLength: 0,
      minSin: 1,
    };
    for (const {from, to} of interpolations) {
      const points = polygonPointsLerp(from.points, to.points, progress);
      addCurveToCurve(curve, getPolylineProfile(points, 0, false));
    }
    return curve;
  };
}
