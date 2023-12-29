import {Vector2, clamp} from '@motion-canvas/core';
import {CircleSegment} from './CircleSegment';
import {CurveProfile} from './CurveProfile';
import {LineSegment} from './LineSegment';

export function getPolylineProfile(
  points: readonly Vector2[],
  radius: number,
  closed: boolean,
): CurveProfile {
  const profile: CurveProfile = {
    arcLength: 0,
    segments: [],
    minSin: 1,
  };

  if (points.length === 0) {
    return profile;
  }

  if (closed) {
    const middle = points[0].add(points[points.length - 1]).scale(0.5);
    points = [middle, ...points, middle];
  }

  let last = points[0];
  for (let i = 2; i < points.length; i++) {
    const start = points[i - 2];
    const center = points[i - 1];
    const end = points[i];

    const centerToStart = start.sub(center);
    const centerToEnd = end.sub(center);
    const startVector = centerToStart.normalized.safe;
    const endVector = centerToEnd.normalized.safe;
    const angleBetween = Math.acos(clamp(-1, 1, startVector.dot(endVector)));
    const angleTan = Math.tan(angleBetween / 2);
    const angleSin = Math.sin(angleBetween / 2);

    const safeRadius = Math.min(
      radius,
      angleTan * centerToStart.magnitude * (i === 2 ? 1 : 0.5),
      angleTan * centerToEnd.magnitude * (i === points.length - 1 ? 1 : 0.5),
    );

    const circleOffsetDistance = angleSin === 0 ? 0 : safeRadius / angleSin;
    const pointOffsetDistance = angleTan === 0 ? 0 : safeRadius / angleTan;
    const circleDistance = startVector
      .add(endVector)
      .scale(1 / 2)
      .normalized.safe.scale(circleOffsetDistance)
      .add(center);

    const counter = startVector.perpendicular.dot(endVector) < 0;
    const line = new LineSegment(
      last,
      center.add(startVector.scale(pointOffsetDistance)),
    );
    const circle = new CircleSegment(
      circleDistance,
      safeRadius,
      startVector.perpendicular.scale(counter ? 1 : -1),
      endVector.perpendicular.scale(counter ? -1 : 1),
      counter,
    );

    if (line.arcLength > 0) {
      profile.segments.push(line);
      profile.arcLength += line.arcLength;
    }
    if (circle.arcLength > 0) {
      profile.segments.push(circle);
      profile.arcLength += circle.arcLength;
    }

    profile.minSin = Math.min(profile.minSin, Math.abs(angleSin));

    last = center.add(endVector.scale(pointOffsetDistance));
  }

  const line = new LineSegment(last, points[points.length - 1]);
  if (line.arcLength > 0) {
    profile.segments.push(line);
    profile.arcLength += line.arcLength;
  }

  return profile;
}
