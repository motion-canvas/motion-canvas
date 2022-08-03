import Color from 'colorjs.io';
import type {Rect, Vector2, PossibleSpacing, Spacing} from '../types';

export interface TweenFunction<T, Rest extends unknown[] = unknown[]> {
  (from: T, to: T, value: number, ...args: Rest): T;
}

export function textTween(from: string, to: string, value: number) {
  // left to right
  if (to.length >= from.length) {
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
    const text = [];
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

/**
 * Interpolate between any two Records, including objects and Maps, even with mismatched keys.
 * Any old key that is missing in `to` will be removed immediately once value is not 0.
 * Any new key that is missing in `from` will be added once value reaches 1.
 *
 * @param from - the input to favor when value is 0
 * @param to - the input to favor when value is 1
 * @param value - on a scale between 0 and 1, how closely to favor from vs to
 * @returns a value matching the structure of from and to
 */
export function deepTween<
  TFrom extends Record<any, unknown>,
  TTo extends Record<any, unknown>,
>(from: TFrom, to: TTo, value: number): TFrom | TTo;
/**
 * Interpolate between any two values, including objects, arrays, and Maps.
 *
 * @param from - the input to favor when value is 0
 * @param to - the input to favor when value is 1
 * @param value - on a scale between 0 and 1, how closely to favor from vs to
 * @returns a value matching the structure of from and to
 */
export function deepTween<T>(from: T, to: T, value: number): T;
export function deepTween(from: any, to: any, value: number): any {
  if (value === 0) return from;
  if (value === 1) return to;

  if (typeof from === 'undefined' || typeof to === 'undefined') {
    return undefined;
  }

  if (typeof from === 'number' && typeof to === 'number') {
    return map(from, to, value);
  }

  if (typeof from === 'string' && typeof to === 'string') {
    try {
      Color.parse(from);
      Color.parse(to);
      return colorTween(from, to, value);
    } catch (err) {
      // inputs are not colors
    }

    return textTween(from, to, value);
  }

  if (from && to && typeof from === 'object' && typeof to === 'object') {
    if (Array.isArray(from) && Array.isArray(to)) {
      if (from.length === to.length) {
        return from.map((f, i) => deepTween(f, to[i], value));
      }
    } else {
      let toObject = false;
      if (!(from instanceof Map) && !(to instanceof Map)) {
        toObject = true;
        from = new Map(Object.entries(from));
        to = new Map(Object.entries(to));
      }

      if (from instanceof Map && to instanceof Map) {
        const result = new Map();
        for (const key of new Set([...from.keys(), ...to.keys()])) {
          const inter = deepTween(from.get(key), to.get(key), value);
          if (inter) result.set(key, inter);
        }
        return toObject ? Object.fromEntries(result) : result;
      }
    }
  }

  // fallback with an immediate jump to the new value
  return to;
}

interface ColorTweenOptions {
  /**
   * the space to use during interpolation, affecting the intermediate colors
   */
  space: string;
  /**
   * the format in which to return values
   */
  outputSpace: string;
}

/**
 * Mix two colors together.
 *
 * @param from - the value to use at 0
 * @param to - the value to use at 1
 * @param value - how much of each color to use, on a scale of 0 to 1
 * @returns an srgb string, or one of the input values if value is 0 or 1
 */
export function colorTween(
  from: string | typeof Color,
  to: string | typeof Color,
  value: number,
  options?: ColorTweenOptions,
): string {
  if (value === 0) return from;
  if (value === 1) return to;
  const range = new Color(from).range(to, {
    space: options?.space ?? 'srgb',
    outputSpace: options?.outputSpace ?? 'srgb',
  });
  return range(value).toString();
}

/**
 * @deprecated Use {@link deepTween} instead.
 */
export function vector2dTween(from: Vector2, to: Vector2, value: number) {
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

export function clamp(min: number, max: number, value: number) {
  return value < min ? min : value > max ? max : value;
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

  return clamp(fromOut, toOut, remappedValue);
}
