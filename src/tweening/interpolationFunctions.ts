import {map, remap} from './tweenFunctions';

export interface InterpolationFunction {
  (value: number, from?: number, to?: number): number;
}

export function easeInOutCirc(value: number, from = 0, to = 1) {
  value =
    value < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * value, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * value + 2, 2)) + 1) / 2;
  return map(from, to, value);
}

export function easeOutExpo(value: number, from = 0, to = 1) {
  value = value === 1 ? 1 : 1 - Math.pow(2, -10 * value);
  return map(from, to, value);
}

export function easeInExpo(value: number, from = 0, to = 1) {
  value = value === 0 ? 0 : Math.pow(2, 10 * value - 10);
  return map(from, to, value);
}

export function linear(value: number, from = 0, to = 1) {
  return map(from, to, value);
}

export function sin(value: number, from = 0, to = 1) {
  return remap(-1, 1, from, to, Math.sin(value));
}

export function cos(value: number, from = 0, to = 1) {
  return remap(-1, 1, from, to, Math.cos(value));
}

export function easeInOutCubic(value: number, from = 0, to = 1) {
  value =
    value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  return map(from, to, value);
}

export function easeInOutQuint(value: number, from = 0, to = 1) {
  value =
    value < 0.5
      ? 16 * value * value * value * value * value
      : 1 - Math.pow(-2 * value + 2, 5) / 2;
  return map(from, to, value);
}
