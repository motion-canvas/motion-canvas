import mixColor from 'mix-color';
import {IRect, Vector2d} from 'konva/lib/types';
import {PossibleSpacing, Spacing} from '../types';

export interface TweenFunction<T, Rest extends any[] = any[]> {
  (from: T, to: T, value: number, ...args: Rest): T;
}

export function textTween(from: string, to: string, value: number) {
  // left to right
  if (to.length > from.length) {
    const current = Math.floor(to.length * value);
    const currentLength = Math.floor(map(from.length - 1, to.length, value));
    let text = '';
    for (let i = 0; i < to.length; i++) {
      if (i < current) {
        text += to[i];
      } else if (from[i] || i <= currentLength) {
        text += from[i] ?? to[i];
      }
    }

    return text;
  }
  // right to left
  else {
    const current = Math.round(from.length * (1 - value));
    const currentLength = Math.floor(map(from.length + 1, to.length, value));
    let text = [];
    for (let i = from.length - 1; i >= 0; i--) {
      if (i < current) {
        text.unshift(from[i]);
      } else if (to[i] || i < currentLength) {
        text.unshift(to[i] ?? from[i]);
      }
    }

    return text.join('');
  }
}

export function colorTween(from: string, to: string, value: number) {
  return mixColor(from, to, value);
}

export function vector2dTween(from: Vector2d, to: Vector2d, value: number) {
  return {
    x: map(from.x, to.x, value),
    y: map(from.y, to.y, value),
  };
}

export function spacingTween(
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

export function rectArcTween(
  from: Partial<IRect>,
  to: Partial<IRect>,
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

export function calculateRatio(from: Partial<IRect>, to: Partial<IRect>): number {
  let numberOfValues = 0;
  let ratio = 0;
  if(from.x) {
    ratio += Math.abs((from.x - to.x) / (from.y - to.y));
    numberOfValues++;
  }
  if (from.width) {
    ratio += Math.abs((from.width - to.width) / (from.height - to.height));
    numberOfValues ++;
  }

  if (numberOfValues) {
    ratio /= numberOfValues;
  }

  return ratio;
}

export function map(from: number, to: number, value: number) {
  return from + (to - from) * value;
}

export function remap(
  fromIn: number,
  toIn: number,
  fromOut: number,
  toOut: number,
  value: number,
) {
  return fromOut + ((value - fromIn) * (toOut - fromOut)) / (toIn - fromIn);
}

export function clampRemap(
  fromIn: number,
  toIn: number,
  fromOut: number,
  toOut: number,
  value: number,
) {
  const remappedValue = remap(fromIn, toIn, fromOut, toOut, value);
  if (fromOut > toOut) [fromOut, toOut] = [toOut, fromOut];

  return remappedValue < fromOut
    ? fromOut
    : remappedValue > toOut
    ? toOut
    : remappedValue;
}
