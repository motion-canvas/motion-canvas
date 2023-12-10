import {Vector2} from '../types';
import {useLogger} from '../utils';

export interface InterpolationFunction<T, TRest extends any[] = any[]> {
  (from: T, to: T, value: number, ...args: TRest): T;
}

export function textLerp(from: string, to: string, value: number) {
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
 * Interpolate between any two Records, including objects and Maps, even with
 * mismatched keys.
 *
 * @remarks
 * Any old key that is missing in `to` will be removed immediately once value is
 * not 0. Any new key that is missing in `from` will be added once value reaches
 * 1.
 *
 * @param from - The input to favor when value is 0.
 * @param to - The input to favor when value is 1.
 * @param value - On a scale between 0 and 1, how closely to favor from vs to.
 *
 * @returns A value matching the structure of from and to.
 */
export function deepLerp<
  TFrom extends Record<any, unknown>,
  TTo extends Record<any, unknown>,
>(from: TFrom, to: TTo, value: number): TFrom | TTo;
export function deepLerp<
  TFrom extends Record<any, unknown>,
  TTo extends Record<any, unknown>,
>(from: TFrom, to: TTo, value: number, suppressWarnings: boolean): TFrom | TTo;
/**
 * Interpolate between any two values, including objects, arrays, and Maps.
 *
 * @param from - The input to favor when value is 0.
 * @param to - The input to favor when value is 1.
 * @param value - On a scale between 0 and 1, how closely to favor from vs to.
 *
 * @returns A value matching the structure of from and to.
 */
export function deepLerp<T>(from: T, to: T, value: number): T;
export function deepLerp<T>(
  from: T,
  to: T,
  value: number,
  suppressWarnings: boolean,
): T;
export function deepLerp(
  from: any,
  to: any,
  value: number,
  suppressWarnings = false,
): any {
  if (value === 0) return from;
  if (value === 1) return to;

  if (from == null || to == null) {
    if (!suppressWarnings) {
      useLogger().warn(
        `Attempting to lerp ${from} -> ${to} may result in unexpected behavior.`,
      );
    }
    return undefined;
  }

  if (typeof from === 'number' && typeof to === 'number') {
    return map(from, to, value);
  }

  if (typeof from === 'string' && typeof to === 'string') {
    return textLerp(from, to, value);
  }

  if (typeof from === 'boolean' && typeof to === 'boolean') {
    return value < 0.5 ? from : to;
  }

  if ('lerp' in from) {
    return from.lerp(to, value);
  }

  if (from && to && typeof from === 'object' && typeof to === 'object') {
    if (Array.isArray(from) && Array.isArray(to)) {
      if (from.length === to.length) {
        return from.map((f, i) => deepLerp(f, to[i], value));
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
          const inter = deepLerp(from.get(key), to.get(key), value, true);
          if (inter !== undefined) result.set(key, inter);
        }
        return toObject ? Object.fromEntries(result) : result;
      }
    }
  }

  // fallback with an immediate jump to the new value
  return to;
}

export function boolLerp<T>(from: T, to: T, value: number): T {
  return value < 0.5 ? from : to;
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

export function arcLerp(
  value: number,
  reverse: boolean,
  ratio: number,
): Vector2 {
  let flip = reverse;
  if (ratio > 1) {
    ratio = 1 / ratio;
  } else {
    flip = !flip;
  }

  const normalized = flip
    ? Math.acos(clamp(-1, 1, 1 - value))
    : Math.asin(value);
  const radians = map(normalized, map(0, Math.PI / 2, value), ratio);

  let xValue = Math.sin(radians);
  let yValue = 1 - Math.cos(radians);
  if (reverse) {
    [xValue, yValue] = [yValue, xValue];
  }

  return new Vector2(xValue, yValue);
}
