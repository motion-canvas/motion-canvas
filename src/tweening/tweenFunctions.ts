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
) {
  value = map(0, Math.PI / 2, value);
  let xValue = Math.sin(value);
  let yValue = 1 - Math.cos(value);
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
