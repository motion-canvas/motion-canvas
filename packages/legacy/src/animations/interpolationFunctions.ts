import {PossibleSpacing, Rect, Size, Spacing, Vector2} from '../types';
import {map} from '@motion-canvas/core/lib/tweening';

export function vector2dLerp(from: Vector2, to: Vector2, value: number) {
  return {
    x: map(from.x, to.x, value),
    y: map(from.y, to.y, value),
  };
}

export function sizeLerp(from: Size, to: Size, value: number) {
  return {
    width: map(from.width, to.width, value),
    height: map(from.height, to.height, value),
  };
}

export function spacingLerp(
  from: Spacing,
  to: Spacing,
  value: number,
): PossibleSpacing {
  return [
    map(from.top, to.top, value),
    map(from.right, to.right, value),
    map(from.bottom, to.bottom, value),
    map(from.left, to.left, value),
  ];
}

export function rectArcLerp(
  from: Partial<Rect>,
  to: Partial<Rect>,
  value: number,
  reverse?: boolean,
  ratio?: number,
) {
  ratio ??= calculateRatio(from, to);

  let flip = reverse;
  if (ratio > 1) {
    ratio = 1 / ratio;
  } else {
    flip = !flip;
  }

  const normalized = flip ? Math.acos(1 - value) : Math.asin(value);
  const radians = map(normalized, map(0, Math.PI / 2, value), ratio);

  let xValue = Math.sin(radians);
  let yValue = 1 - Math.cos(radians);
  if (reverse) {
    [xValue, yValue] = [yValue, xValue];
  }

  return {
    x: map(from.x ?? 0, to.x ?? 0, xValue),
    y: map(from.y ?? 0, to.y ?? 0, yValue),
    width: map(from.width ?? 0, to.width ?? 0, xValue),
    height: map(from.height ?? 0, to.height ?? 0, yValue),
  };
}

export function calculateRatio(from: Partial<Rect>, to: Partial<Rect>): number {
  let numberOfValues = 0;
  let ratio = 0;
  if (from.x) {
    ratio += Math.abs((from.x - to.x) / (from.y - to.y));
    numberOfValues++;
  }
  if (from.width) {
    ratio += Math.abs((from.width - to.width) / (from.height - to.height));
    numberOfValues++;
  }

  if (numberOfValues) {
    ratio /= numberOfValues;
  }

  return isNaN(ratio) ? 1 : ratio;
}
