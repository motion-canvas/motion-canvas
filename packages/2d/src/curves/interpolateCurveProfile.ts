import {clampRemap} from '@motion-canvas/core/lib/tweening';
import {Vector2} from '@motion-canvas/core/lib/types';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {CubicBezierSegment} from './CubicBezierSegment';
import {CurveProfile} from './CurveProfile';
import {LineSegment} from './LineSegment';
import {QuadBezierSegment} from './QuadBezierSegment';
import {Segment} from './Segment';
import {ArcSegment} from './ArcSegment';

// code are adapted from d3-interpolate-path

function splitSegmentInto(segment: Segment, count: number) {
  const result: Segment[] = [];

  let remainingSegment = segment;
  for (let i = 0; i < count - 1; i++) {
    const split = (remainingSegment as CubicBezierSegment).split(
      1 / (count - i),
    );
    result.push(split[0]);
    remainingSegment = split[1];
  }
  result.push(remainingSegment);

  return result;
}

// Based on https://mortoray.com/rendering-an-svg-elliptical-arc-as-bezier-curves/

function arcPartToCubic(
  segment: ArcSegment,
  startAngle: number,
  endAngle: number,
) {
  const startPoint = segment.getAnglePosition(startAngle);
  const endPoint = segment.getAnglePosition(endAngle);

  const alpha =
    (Math.sin(endAngle - startAngle) *
      (Math.sqrt(4 + 3 * Math.pow(Math.tan((endAngle - startAngle) / 2), 2)) -
        1)) /
    3;
  const control1 = startPoint.add(
    segment.getAngleDerivative(startAngle).scale(alpha),
  );
  const control2 = endPoint.sub(
    segment.getAngleDerivative(endAngle).scale(alpha),
  );
  return new CubicBezierSegment(startPoint, control1, control2, endPoint);
}

// based on svg-arc-to-cubic-bezier

function arcToCubics(segment: ArcSegment) {
  let ratio = Math.abs(segment.deltaAngle) / (Math.PI / 4);
  if (ratio % 1 < 0.0000001) {
    ratio = Math.floor(ratio);
  }
  const count = Math.max(Math.ceil(ratio), 1);
  const angleIncrement = segment.deltaAngle / count;

  const result: CubicBezierSegment[] = [];

  let currentAngle = segment.startAngle;
  for (let i = 0; i < count; i++) {
    const nextAngle = currentAngle + angleIncrement;
    result.push(arcPartToCubic(segment, currentAngle, nextAngle));
    currentAngle = nextAngle;
  }

  return result;
}

function convertToCubicProfile(profile: CurveProfile): CurveProfile {
  return {
    arcLength: profile.arcLength,
    minSin: profile.minSin,
    segments: profile.segments.reduce<Segment[]>((accum, segment) => {
      if (segment instanceof LineSegment)
        accum.push(
          new CubicBezierSegment(
            segment.from,
            segment.from,
            segment.to,
            segment.to,
          ),
        );
      else if (segment instanceof QuadBezierSegment) {
        accum.push(
          new CubicBezierSegment(
            segment.p0,
            segment.p0.div(3).add(segment.p1.mul(2 / 3)),
            segment.p2.div(3).add(segment.p1.mul(2 / 3)),
            segment.p2,
          ),
        );
      } else if (segment instanceof ArcSegment) {
        accum.push(...arcToCubics(segment));
      } else if (segment instanceof CubicBezierSegment) accum.push(segment);
      else
        useLogger().error(
          `Cannot convert ${segment.constructor.name} into CubiBezierCurve`,
        );
      return accum;
    }, []),
  };
}

function extendProfile(
  toExtend: CurveProfile,
  reference: CurveProfile,
): CurveProfile {
  const numToExtend = toExtend.segments.length;
  const numReference = reference.segments.length;
  const segmentRatio = numToExtend / numReference;

  const countPointPerSegments = new Array(numReference)
    .fill(null)
    .reduce<number[]>((prev, _, i) => {
      const insertIndex = Math.floor(segmentRatio * i);

      prev[insertIndex] = (prev[insertIndex] || 0) + 1;
      return prev;
    }, []);

  const extended = countPointPerSegments.reduce<Segment[]>(
    (prev, segmentCount, i) => {
      const segment = toExtend.segments[i];
      prev.push(...splitSegmentInto(segment, segmentCount));
      return prev;
    },
    [],
  );

  return {
    arcLength: toExtend.arcLength,
    minSin: toExtend.minSin,
    segments: extended,
  };
}

function removeTailSegments(profile: CurveProfile, startIndex: number) {
  const result: CurveProfile = {
    minSin: profile.minSin,
    arcLength: 0,
    segments: [],
  };
  for (let i = 0; i < startIndex; i++) {
    const segment = profile.segments[i];
    result.segments.push(segment);
    result.arcLength += segment.arcLength;
  }
  return result;
}

function alignCurve(
  toAligned: CurveProfile,
  reference: CurveProfile,
): CurveProfile {
  let startIndex = 0;
  const segment = reference.segments[0] as CubicBezierSegment;
  let minDiff = Infinity;
  for (let i = 0; i < toAligned.segments.length; i++) {
    const diff = (toAligned.segments[i] as CubicBezierSegment).p0.sub(
      segment.p0,
    ).magnitude;
    if (diff < minDiff) {
      minDiff = diff;
      startIndex = i;
    }
  }
  useLogger().info(`best ${startIndex}`);
  return {
    minSin: toAligned.minSin,
    arcLength: toAligned.arcLength,
    segments: toAligned.segments
      .slice(startIndex)
      .concat(toAligned.segments.slice(0, startIndex)),
  };
}

function removeSubPath(profile: CurveProfile) {
  const result: CurveProfile = {
    minSin: profile.minSin,
    segments: [],
    arcLength: 0,
  };
  let lastPoint: Vector2 | null = null;
  let index = 0;
  do {
    const segment = profile.segments[index] as CubicBezierSegment;
    if (lastPoint && !lastPoint.equals(segment.p0)) {
      break;
    }
    result.segments.push(segment);
    result.arcLength += segment.arcLength;
    lastPoint = segment.p3;
    index++;
  } while (index < profile.segments.length);

  for (let i = index; i < profile.segments.length; i++) {
    result.segments.push(
      new CubicBezierSegment(lastPoint, lastPoint, lastPoint, lastPoint),
    );
  }

  return {
    profile: result,
    index,
    hasSubPath: index !== profile.segments.length,
  };
}

function interpolate(
  from: CurveProfile,
  to: CurveProfile,
  progress: number,
): CurveProfile {
  if (progress === 0) return from;
  if (progress === 1) return to;
  const profile: CurveProfile = {
    minSin: from.minSin,
    arcLength: 0,
    segments: [],
  };

  for (let i = 0; i < from.segments.length; i++) {
    const aSegment = from.segments[i] as CubicBezierSegment;
    const bSegment = to.segments[i] as CubicBezierSegment;
    const segment = new CubicBezierSegment(
      Vector2.lerp(aSegment.p0, bSegment.p0, progress),
      Vector2.lerp(aSegment.p1, bSegment.p1, progress),
      Vector2.lerp(aSegment.p2, bSegment.p2, progress),
      Vector2.lerp(aSegment.p3, bSegment.p3, progress),
    );
    profile.segments.push(segment);
    profile.arcLength += segment.arcLength;
  }
  return profile;
}

function balanceCurve(aProfile: CurveProfile, bProfile: CurveProfile) {
  if (aProfile.segments.length < bProfile.segments.length) {
    aProfile = extendProfile(aProfile, bProfile);
  } else if (bProfile.segments.length < aProfile.segments.length) {
    bProfile = extendProfile(bProfile, aProfile);
  }
  return [aProfile, bProfile];
}

export function interpolateCurveProfile(
  from: CurveProfile,
  to: CurveProfile,
  align: boolean,
): (t: number) => CurveProfile {
  let aProfile: CurveProfile =
    from.segments.length > 0
      ? from
      : {
          arcLength: to.segments[0].arcLength,
          minSin: to.minSin,
          segments: [to.segments[0]],
        };
  let bProfile: CurveProfile =
    to.segments.length > 0
      ? to
      : {
          arcLength: from.segments[0].arcLength,
          minSin: from.minSin,
          segments: [from.segments[0]],
        };

  aProfile = convertToCubicProfile(aProfile);
  bProfile = convertToCubicProfile(bProfile);

  const step: CurveProfile[][] = [];

  const aRemovedSubPath = removeSubPath(aProfile);

  if (aRemovedSubPath.hasSubPath) {
    step.push([aProfile, aRemovedSubPath.profile]);
    aProfile = removeTailSegments(aProfile, aRemovedSubPath.index);
  }

  const bRemovedSubPath = removeSubPath(bProfile);

  if (bRemovedSubPath.hasSubPath) {
    const [a, b] = balanceCurve(
      aRemovedSubPath.profile,
      bRemovedSubPath.profile,
    );
    step.push([align ? alignCurve(a, b) : a, b]);
    aProfile = bRemovedSubPath.profile;
  }

  [aProfile, bProfile] = balanceCurve(aProfile, bProfile);
  step.push([align ? alignCurve(aProfile, bProfile) : aProfile, bProfile]);

  const stepCount = step.length;

  const times: number[] = [];
  if (stepCount === 1) times.push(1);
  else if (stepCount === 2) times.push(0.1, 1);
  else if (stepCount === 3) times.push(0.1, 0.9, 1);

  return (t: number) => {
    const index = times.findIndex(time => t <= time);
    const [from, to] = step[index];
    const progress = clampRemap(
      index > 0 ? times[index - 1] : 0,
      times[index],
      0,
      1,
      t,
    );
    return interpolate(from, to, progress);
  };
}
