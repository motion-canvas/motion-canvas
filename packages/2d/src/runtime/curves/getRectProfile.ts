import {BBox, Spacing, Vector2} from '@motion-canvas/core';
import {adjustRectRadius} from '../utils';
import {CircleSegment} from './CircleSegment';
import {CubicBezierSegment} from './CubicBezierSegment';
import {CurveProfile} from './CurveProfile';
import {LineSegment} from './LineSegment';
import {Segment} from './Segment';

export function getRectProfile(
  rect: BBox,
  radius: Spacing,
  smoothCorners: boolean,
  cornerSharpness: number,
): CurveProfile {
  const profile: CurveProfile = {
    arcLength: 0,
    segments: [],
    minSin: 1,
  };

  const topLeft = adjustRectRadius(radius.top, radius.right, radius.left, rect);
  const topRight = adjustRectRadius(
    radius.right,
    radius.top,
    radius.bottom,
    rect,
  );
  const bottomRight = adjustRectRadius(
    radius.bottom,
    radius.left,
    radius.right,
    rect,
  );
  const bottomLeft = adjustRectRadius(
    radius.left,
    radius.bottom,
    radius.top,
    rect,
  );

  let from = new Vector2(rect.left + topLeft, rect.top);
  let to = new Vector2(rect.right - topRight, rect.top);
  addSegment(profile, new LineSegment(from, to));

  from = new Vector2(rect.right, rect.top + topRight);
  to = new Vector2(rect.right, rect.bottom - bottomRight);
  if (topRight > 0) {
    addCornerSegment(
      profile,
      from.addX(-topRight),
      topRight,
      Vector2.down,
      Vector2.right,
      smoothCorners,
      cornerSharpness,
    );
  }
  addSegment(profile, new LineSegment(from, to));

  from = new Vector2(rect.right - bottomRight, rect.bottom);
  to = new Vector2(rect.left + bottomLeft, rect.bottom);
  if (bottomRight > 0) {
    addCornerSegment(
      profile,
      from.addY(-bottomRight),
      bottomRight,
      Vector2.right,
      Vector2.up,
      smoothCorners,
      cornerSharpness,
    );
  }
  addSegment(profile, new LineSegment(from, to));

  from = new Vector2(rect.left, rect.bottom - bottomLeft);
  to = new Vector2(rect.left, rect.top + topLeft);
  if (bottomLeft > 0) {
    addCornerSegment(
      profile,
      from.addX(bottomLeft),
      bottomLeft,
      Vector2.up,
      Vector2.left,
      smoothCorners,
      cornerSharpness,
    );
  }
  addSegment(profile, new LineSegment(from, to));

  from = new Vector2(rect.left + topLeft, rect.top);
  if (topLeft > 0) {
    addCornerSegment(
      profile,
      from.addY(topLeft),
      topLeft,
      Vector2.left,
      Vector2.down,
      smoothCorners,
      cornerSharpness,
    );
  }

  return profile;
}

function addSegment(profile: CurveProfile, segment: Segment) {
  profile.segments.push(segment);
  profile.arcLength += segment.arcLength;
}

function addCornerSegment(
  profile: CurveProfile,
  center: Vector2,
  radius: number,
  fromNormal: Vector2,
  toNormal: Vector2,
  smooth: boolean,
  sharpness: number,
) {
  const from = center.add(fromNormal.scale(radius));
  const to = center.add(toNormal.scale(radius));
  if (smooth) {
    addSegment(
      profile,
      new CubicBezierSegment(
        from,
        from.add(toNormal.scale(sharpness * radius)),
        to.add(fromNormal.scale(sharpness * radius)),
        to,
      ),
    );
  } else {
    addSegment(
      profile,
      new CircleSegment(center, radius, fromNormal, toNormal, false),
    );
  }
}
