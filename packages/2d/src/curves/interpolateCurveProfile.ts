import {Vector2} from '@motion-canvas/core/lib/types';
import {CurveProfile} from './CurveProfile';
import {LineSegment} from './LineSegment';
import {getPointAtDistance} from './getPointAtDistance';
import {getPolylineProfile} from './getPolylineProfile';

// Based on kute.js svgMorph plugin

/**
 * Remove last point if it equal first point. This function mutate original points.
 * @param points - Polygon points
 */

function removeRecurringPoint(points: Vector2[]) {
  if (points.length > 1 && points[0].equals(points[points.length - 1])) {
    points.pop();
  }
}

/**
 * Split segments of polygon until distance between adjacent point is less than or equal maxLength. This function mutate original points.
 * @param points - Polygon points
 * @param maxLength - max distance between two point
 */

function bisect(points: Vector2[], maxLength: number) {
  let a: Vector2;
  let b: Vector2;

  for (let i = 0; i < points.length; i++) {
    a = points[i];
    b = i === points.length - 1 ? points[0] : points[i + 1];
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

function exactPolygon(
  curve: CurveProfile,
  maxLength: number,
): Vector2[] | null {
  const points: Vector2[] = [];

  let endPoint: Vector2 | null = null;
  for (const segment of curve.segments) {
    if (!(segment instanceof LineSegment)) return null;

    points.push(segment.from);

    endPoint = segment.to;
  }

  if (endPoint && !endPoint.equals(points[0])) points.push(endPoint);

  removeRecurringPoint(points);

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
  const n = points.length;
  let i = -1;
  let a;
  let b = points[n - 1];
  let area = 0;

  while (++i < n) {
    a = b;
    b = points[i];
    area += a.y * b.x - a.x * b.y;
  }

  return area / 2;
}

/**
 * Convert curve into polygon by sampling curve profile
 * @param curve - curve to convert. curve must contain only 1 subpath
 * @param maxLength - max distance between point
 * @returns - always return polygon points
 */

function approximatePolygon(curve: CurveProfile, maxLength: number): Vector2[] {
  const points: Vector2[] = [];

  let numPoints = 3;
  if (!Number.isNaN(maxLength) && maxLength > 0) {
    numPoints = Math.max(numPoints, Math.ceil(curve.arcLength / maxLength));
  }

  for (let i = 0; i < numPoints; i += 1) {
    const point = getPointAtDistance(curve, curve.arcLength * (i / numPoints));
    points.push(point.position);
  }

  if (polygonArea(points) > 0) points.reverse();

  removeRecurringPoint(points);

  return points;
}

/**
 * Split curve into subpaths
 * @param curve - curve to split
 * @returns - subpaths of curve
 */

function splitCurve(curve: CurveProfile) {
  let current: CurveProfile = {
    arcLength: 0,
    minSin: 0,
    segments: [],
  };
  let endPoint: Vector2 | null = null;

  const composite: CurveProfile[] = [current];

  for (const segment of curve.segments) {
    if (endPoint && !segment.getPoint(0).position.equals(endPoint)) {
      current = {
        arcLength: 0,
        minSin: 0,
        segments: [],
      };
      composite.push(current);
    }

    current.segments.push(segment);
    current.arcLength += segment.arcLength;
    endPoint = segment.getPoint(1).position;
  }

  return composite;
}

/**
 * Convert curve into polygon use best possible method
 * @param curve - curve to convert
 * @param maxLength - max distance between two point
 * @returns - polgon points
 */

function curveToPolygon(curve: CurveProfile, maxLength: number) {
  const firstCurve = splitCurve(curve)[0];
  const points =
    exactPolygon(firstCurve, maxLength) ||
    approximatePolygon(firstCurve, maxLength);
  return [...points];
}

/**
 * Calculate polygon perimeter
 * @param points - polygon points
 * @returns - perimeter of polygon
 */

function polygonLength(points: Vector2[]) {
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
 * Rotate polygon in order to minimize moving points
 * @param points - polygon points to be rotated
 * @param reference - polygon points to be reference
 */

function rotatePolygon(points: Vector2[], reference: Vector2[]) {
  const len = points.length;
  let min = Infinity;
  let bestOffset = 0;

  for (let offset = 0; offset < len; offset += 1) {
    let sumOfSquares = 0;

    for (let i = 0; i < reference.length; i += 1) {
      const a = points[(offset + i) % len];
      const b = reference[i];
      sumOfSquares += a.sub(b).squaredMagnitude;
    }

    if (sumOfSquares < min) {
      min = sumOfSquares;
      bestOffset = offset;
    }
  }

  if (bestOffset) {
    const spliced = points.splice(0, bestOffset);
    points.splice(points.length, 0, ...spliced);
  }
}

/**
 * Round polygon's points coordinate to a specified amount of decimal
 * @param points - polygon point to be rounded
 * @param round - amount of decimal
 * @returns - new polygon point
 */

function roundPolygon(points: Vector2[], round: number) {
  const pow = round >= 1 ? 10 ** round : 1;
  return points.map(point => {
    const [x, y] = [point.x, point.y].map(n => Math.round(n * pow) / pow);
    return new Vector2(x, y);
  });
}

/**
 * Create two polygon ready to tween.
 * @param from - source curve
 * @param to - targe curve
 * @param precision - desired distance between two point
 * @param round - amount of decimal when rounding
 * @returns two polygon ready to tween
 */

function getInterpolationPoints(
  from: CurveProfile,
  to: CurveProfile,
  precision: number,
  round: number,
) {
  const morphPrecision = precision;
  const fromRing = curveToPolygon(from, morphPrecision);
  const toRing = curveToPolygon(to, morphPrecision);
  const diff = fromRing.length - toRing.length;

  addPoints(fromRing, diff < 0 ? diff * -1 : 0);
  addPoints(toRing, diff > 0 ? diff : 0);

  rotatePolygon(fromRing, toRing);

  return {
    from: roundPolygon(fromRing, round),
    to: roundPolygon(toRing, round),
  };
}

/**
 * Interpolate between two polygon points.
 * @param from - source polygon points
 * @param to - target polygon points
 * @param progress - interpolation progress
 * @returns - new polygon points
 */

function interpolatePolygon(
  from: Vector2[],
  to: Vector2[],
  progress: number,
): Vector2[] {
  const points: Vector2[] = [];
  if (progress === 0) return [...from];
  if (progress === 1) return [...to];

  for (let i = 0; i < from.length; i++) {
    const a = from[i];
    const b = to[i];
    points.push(Vector2.lerp(a, b, progress));
  }
  return points;
}

/**
 * Create interpolator to tween between two curve
 * @param a - source curve
 * @param b - target curve
 * @returns - curve interpolator
 */

export function interpolateCurveProfile(a: CurveProfile, b: CurveProfile) {
  const {from, to} = getInterpolationPoints(a, b, 5, 4);

  return (progress: number) => {
    const polygon = interpolatePolygon(from, to, progress);
    return getPolylineProfile(polygon, 0, true);
  };
}
