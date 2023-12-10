import {Vector2, clamp} from '@motion-canvas/core';
import parse, {PathCommand} from 'parse-svg-path';
import {ArcSegment} from './ArcSegment';
import {CubicBezierSegment} from './CubicBezierSegment';
import {CurveProfile} from './CurveProfile';
import {LineSegment} from './LineSegment';
import {QuadBezierSegment} from './QuadBezierSegment';
import {Segment} from './Segment';

function addSegmentToProfile(profile: CurveProfile, segment: Segment) {
  profile.segments.push(segment);
  profile.arcLength += segment.arcLength;
}

function getArg(command: PathCommand, argumentIndex: number) {
  return command[argumentIndex + 1] as number;
}

function getVector2(command: PathCommand, argumentIndex: number) {
  return new Vector2(
    command[argumentIndex + 1] as number,
    command[argumentIndex + 2] as number,
  );
}

function getPoint(
  command: PathCommand,
  argumentIndex: number,
  isRelative: boolean,
  currentPoint: Vector2,
) {
  const point = getVector2(command, argumentIndex);
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

  const segments = parse(data);
  let currentPoint = new Vector2(0, 0);
  let firstPoint: Vector2 | null = null;

  for (const segment of segments) {
    const command = segment[0].toLowerCase();
    const isRelative = segment[0] === command;

    if (command === 'm') {
      currentPoint = getPoint(segment, 0, isRelative, currentPoint);
      firstPoint = currentPoint;
    } else if (command === 'l') {
      const nextPoint = getPoint(segment, 0, isRelative, currentPoint);
      addSegmentToProfile(profile, new LineSegment(currentPoint, nextPoint));
      currentPoint = nextPoint;
    } else if (command === 'h') {
      const x = getArg(segment, 0);
      const nextPoint = isRelative
        ? currentPoint.addX(x)
        : new Vector2(x, currentPoint.y);
      addSegmentToProfile(profile, new LineSegment(currentPoint, nextPoint));
      currentPoint = nextPoint;
    } else if (command === 'v') {
      const y = getArg(segment, 0);
      const nextPoint = isRelative
        ? currentPoint.addY(y)
        : new Vector2(currentPoint.x, y);
      addSegmentToProfile(profile, new LineSegment(currentPoint, nextPoint));
      currentPoint = nextPoint;
    } else if (command === 'q') {
      const controlPoint = getPoint(segment, 0, isRelative, currentPoint);
      const nextPoint = getPoint(segment, 2, isRelative, currentPoint);
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

      const nextPoint = getPoint(segment, 0, isRelative, currentPoint);
      addSegmentToProfile(
        profile,
        new QuadBezierSegment(currentPoint, controlPoint, nextPoint),
      );
      currentPoint = nextPoint;
    } else if (command === 'c') {
      const startControlPoint = getPoint(segment, 0, isRelative, currentPoint);
      const endControlPoint = getPoint(segment, 2, isRelative, currentPoint);
      const nextPoint = getPoint(segment, 4, isRelative, currentPoint);
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

      const endControlPoint = getPoint(segment, 0, isRelative, currentPoint);
      const nextPoint = getPoint(segment, 2, isRelative, currentPoint);
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
      const radius = getVector2(segment, 0);
      const angle = getArg(segment, 2);
      const largeArcFlag = getArg(segment, 3);
      const sweepFlag = getArg(segment, 4);
      const nextPoint = getPoint(segment, 5, isRelative, currentPoint);
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
  }
  updateMinSin(profile);

  return profile;
}
