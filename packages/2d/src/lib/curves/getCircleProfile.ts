import {Vector2} from '@motion-canvas/core';
import {ArcSegment} from './ArcSegment';
import {CurveProfile} from './CurveProfile';
import {LineSegment} from './LineSegment';
import {Segment} from './Segment';

export function getCircleProfile(
  size: Vector2,
  startAngle: number,
  endAngle: number,
  closed: boolean,
  counterclockwise = false,
): CurveProfile {
  const profile: CurveProfile = {
    arcLength: 0,
    minSin: 1,
    segments: [],
  };

  if (endAngle < startAngle) {
    const loops = Math.floor((startAngle - endAngle) / (Math.PI * 2)) + 1;
    endAngle += Math.PI * 2 * loops;
  } else if (endAngle > startAngle + Math.PI * 2) {
    const loops = Math.floor((endAngle - startAngle) / (Math.PI * 2));
    endAngle -= Math.PI * 2 * loops;
  }

  const middleAngle = (startAngle + endAngle) / 2;
  const from = size.mul(Vector2.fromRadians(startAngle));
  const to = size.mul(Vector2.fromRadians(endAngle));
  const middle = size
    .mul(Vector2.fromRadians(middleAngle))
    .scale(counterclockwise ? -1 : 1);

  if (closed) {
    addSegment(profile, new LineSegment(Vector2.zero, from));
  }

  addArcSegment(
    profile,
    size,
    from,
    middle,
    startAngle,
    middleAngle,
    counterclockwise,
  );
  addArcSegment(
    profile,
    size,
    middle,
    to,
    middleAngle,
    endAngle,
    counterclockwise,
  );

  if (closed) {
    addSegment(profile, new LineSegment(to, Vector2.zero));
  }

  return profile;
}

function addSegment(profile: CurveProfile, segment: Segment) {
  profile.segments.push(segment);
  profile.arcLength += segment.arcLength;
}

function addArcSegment(
  profile: CurveProfile,
  size: Vector2,
  from: Vector2,
  to: Vector2,
  fromAngle: number,
  toAngle: number,
  counterclockwise: boolean,
) {
  const small = Math.abs(fromAngle - toAngle) <= 180 ? 1 : 0;
  const flip = fromAngle > toAngle ? 0 : 1;
  const counter = counterclockwise ? 0 : 1;
  addSegment(
    profile,
    new ArcSegment(from, size, 0, 0, small ^ counter ^ flip, to),
  );
}
