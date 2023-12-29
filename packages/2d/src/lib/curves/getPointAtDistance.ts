import {Vector2, clamp} from '@motion-canvas/core';
import {CurvePoint} from './CurvePoint';
import {CurveProfile} from './CurveProfile';

export function getPointAtDistance(
  profile: CurveProfile,
  distance: number,
): CurvePoint {
  const clamped = clamp(0, profile.arcLength, distance);
  let length = 0;
  for (const segment of profile.segments) {
    const previousLength = length;
    length += segment.arcLength;
    if (length >= clamped) {
      const relative = (clamped - previousLength) / segment.arcLength;
      return segment.getPoint(clamp(0, 1, relative));
    }
  }

  return {position: Vector2.zero, tangent: Vector2.up, normal: Vector2.up};
}
