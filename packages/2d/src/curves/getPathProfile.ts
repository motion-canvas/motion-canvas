import {clamp} from '@motion-canvas/core/lib/tweening';
import {Vector2} from '@motion-canvas/core/lib/types';
import {useLogger} from '@motion-canvas/core/lib/utils';
import {ArcSegment} from './ArcSegment';
import {CubicBezierSegment} from './CubicBezierSegment';
import {CurveProfile} from './CurveProfile';
import {LineSegment} from './LineSegment';
import {QuadBezierSegment} from './QuadBezierSegment';
import {Segment} from './Segment';

const SegmentRegex = /[astvzqmhlc][^astvzqmhlc]*/gi;
const ArgumentRegex = /-?[\d.e+-]+/g;
const SegmentArgsCount: Record<string, number> = {
  m: 2,
  l: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  t: 2,
  a: 7,
  z: 0,
};

function addSegmentToProfile(profile: CurveProfile, segment: Segment) {
  profile.segments.push(segment);
  profile.arcLength += segment.arcLength;
}

function parseVector2(args: string[], index: number) {
  return new Vector2(parseFloat(args[index]!), parseFloat(args[index + 1]));
}

function parsePoint(
  args: string[],
  index: number,
  isRelative: boolean,
  currentPoint: Vector2,
) {
  const point = parseVector2(args, index);
  return isRelative ? currentPoint.add(point) : point;
}

function reflectControlPoint(control: Vector2, currentPoint: Vector2) {
  return currentPoint.add(currentPoint.sub(control));
}

function updateMinSin(profile: CurveProfile) {
  for (let i = 0; i < profile.segments.length; i++) {
    const segmentA = profile.segments[i];
    const segmentB = profile.segments[(i + 1) % profile.segments.length];

    // In cubic bezier this equal p2.sub(p3)
    const startVector = segmentA.getPoint(1).tangent.scale(-1);
    // In cubic bezier this equal p1.sub(p0)
    const endVector = segmentB.getPoint(0).tangent;
    const dot = startVector.dot(endVector);

    const angleBetween = Math.acos(clamp(-1, 1, dot));
    const angleSin = Math.sin(angleBetween / 2);

    profile.minSin = Math.min(profile.minSin, Math.abs(angleSin));
  }
}

export function getPathProfile(data: string): CurveProfile {
  const profile: CurveProfile = {
    segments: [],
    arcLength: 0,
    minSin: 1,
  };

  const segments = data.match(SegmentRegex) ?? [];
  let currentPoint = new Vector2(0, 0);
  let firstPoint: Vector2 | null = null;

  for (const segment of segments) {
    const command = segment[0].toLowerCase();
    const isRelative = segment[0] === command;
    const allArgs = segment.match(ArgumentRegex) ?? [];
    const argCount = SegmentArgsCount[command];
    let firstArgs = true;

    do {
      const args = allArgs.splice(0, argCount);
      if (args.length < argCount)
        useLogger().error(
          `Path segment argument count not match at ${segment}`,
        );

      if (command === 'm' && firstArgs) {
        currentPoint = parsePoint(args, 0, isRelative, currentPoint);

        firstPoint = currentPoint;
      } else if (command === 'l' || (command === 'm' && !firstArgs)) {
        const nextPoint = parsePoint(args, 0, isRelative, currentPoint);
        addSegmentToProfile(profile, new LineSegment(currentPoint, nextPoint));
        currentPoint = nextPoint;
      } else if (command === 'h') {
        const x = parseFloat(args[0]!);
        const nextPoint = isRelative
          ? currentPoint.addX(x)
          : new Vector2(x, currentPoint.y);
        addSegmentToProfile(profile, new LineSegment(currentPoint, nextPoint));
        currentPoint = nextPoint;
      } else if (command === 'v') {
        const y = parseFloat(args[0]!);
        const nextPoint = isRelative
          ? currentPoint.addY(y)
          : new Vector2(currentPoint.x, y);
        addSegmentToProfile(profile, new LineSegment(currentPoint, nextPoint));
        currentPoint = nextPoint;
      } else if (command === 'q') {
        const controlPoint = parsePoint(args, 0, isRelative, currentPoint);
        const nextPoint = parsePoint(args, 2, isRelative, currentPoint);
        addSegmentToProfile(
          profile,
          new QuadBezierSegment(currentPoint, controlPoint, nextPoint),
        );
        currentPoint = nextPoint;
      } else if (command === 't') {
        const lastSegment = profile.segments.at(-1);
        const controlPoint =
          lastSegment instanceof QuadBezierSegment
            ? reflectControlPoint(lastSegment.p1, currentPoint)
            : currentPoint;

        const nextPoint = parsePoint(args, 0, isRelative, currentPoint);
        addSegmentToProfile(
          profile,
          new QuadBezierSegment(currentPoint, controlPoint, nextPoint),
        );
        currentPoint = nextPoint;
      } else if (command === 'c') {
        const startControlPoint = parsePoint(args, 0, isRelative, currentPoint);
        const endControlPoint = parsePoint(args, 2, isRelative, currentPoint);
        const nextPoint = parsePoint(args, 4, isRelative, currentPoint);
        addSegmentToProfile(
          profile,
          new CubicBezierSegment(
            currentPoint,
            startControlPoint,
            endControlPoint,
            nextPoint,
          ),
        );
        currentPoint = nextPoint;
      } else if (command === 's') {
        const lastSegment = profile.segments.at(-1);
        const startControlPoint =
          lastSegment instanceof CubicBezierSegment
            ? reflectControlPoint(lastSegment.p2, currentPoint)
            : currentPoint;

        const endControlPoint = parsePoint(args, 0, isRelative, currentPoint);
        const nextPoint = parsePoint(args, 2, isRelative, currentPoint);
        addSegmentToProfile(
          profile,
          new CubicBezierSegment(
            currentPoint,
            startControlPoint,
            endControlPoint,
            nextPoint,
          ),
        );
        currentPoint = nextPoint;
      } else if (command === 'a') {
        const radius = parseVector2(args, 0);
        const angle = parseFloat(args[2]);
        const largeArcFlag = parseFloat(args[3]);
        const sweepFlag = parseFloat(args[4]);
        const nextPoint = parsePoint(args, 5, isRelative, currentPoint);
        addSegmentToProfile(
          profile,
          new ArcSegment(
            currentPoint,
            radius,
            angle,
            largeArcFlag,
            sweepFlag,
            nextPoint,
          ),
        );
        currentPoint = nextPoint;
      } else if (command === 'z') {
        if (!firstPoint) continue;
        if (currentPoint.equals(firstPoint)) continue;

        addSegmentToProfile(profile, new LineSegment(currentPoint, firstPoint));
        currentPoint = firstPoint;
      }

      firstArgs = false;
    } while (allArgs.length > 0);
  }
  updateMinSin(profile);

  return profile;
}
