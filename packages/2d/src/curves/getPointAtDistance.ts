import {clamp} from '@motion-canvas/core/lib/tweening';
import {Vector2} from '@motion-canvas/core/lib/types';
import {CurveProfile} from './CurveProfile';
import {CurvePoint} from './CurvePoint';

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

  return {position: Vector2.zero, tangent: Vector2.up};
}
