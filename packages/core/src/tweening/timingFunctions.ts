import {map, remap} from './interpolationFunctions';

export interface TimingFunction {
  (value: number, from?: number, to?: number): number;
}

/*
 * All easing implementations taken from https://easings.net/
 */

// Sine
export function sin(value: number, from = 0, to = 1) {
  return remap(-1, 1, from, to, Math.sin(value));
}

export function easeInSine(value: number, from = 0, to = 1): number {
  value = 1 - Math.cos((value * Math.PI) / 2);

  return map(from, to, value);
}

export function easeOutSine(value: number, from = 0, to = 1): number {
  value = Math.sin((value * Math.PI) / 2);

  return map(from, to, value);
}

export function easeInOutSine(value: number, from = 0, to = 1): number {
  value = -(Math.cos(Math.PI * value) - 1) / 2;

  return map(from, to, value);
}

// Quadratic
export function easeInQuad(value: number, from = 0, to = 1): number {
  value = value * value;

  return map(from, to, value);
}

export function easeOutQuad(value: number, from = 0, to = 1): number {
  value = 1 - Math.pow(1 - value, 2);

  return map(from, to, value);
}

export function easeInOutQuad(value: number, from = 0, to = 1) {
  value = value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;

  return map(from, to, value);
}

// Cubic
export function easeInCubic(value: number, from = 0, to = 1): number {
  value = value * value * value;

  return map(from, to, value);
}

export function easeOutCubic(value: number, from = 0, to = 1): number {
  value = 1 - Math.pow(1 - value, 3);

  return map(from, to, value);
}

export function easeInOutCubic(value: number, from = 0, to = 1) {
  value =
    value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;

  return map(from, to, value);
}

// Quartic
export function easeInQuart(value: number, from = 0, to = 1): number {
  value = value * value * value * value;

  return map(from, to, value);
}

export function easeOutQuart(value: number, from = 0, to = 1): number {
  value = 1 - Math.pow(1 - value, 4);

  return map(from, to, value);
}

export function easeInOutQuart(value: number, from = 0, to = 1) {
  value =
    value < 0.5
      ? 8 * value * value * value * value
      : 1 - Math.pow(-2 * value + 2, 4) / 2;

  return map(from, to, value);
}

// Quintic
export function easeInQuint(value: number, from = 0, to = 1): number {
  value = value * value * value * value * value;

  return map(from, to, value);
}

export function easeOutQuint(value: number, from = 0, to = 1): number {
  value = 1 - Math.pow(1 - value, 5);

  return map(from, to, value);
}

export function easeInOutQuint(value: number, from = 0, to = 1) {
  value =
    value < 0.5
      ? 16 * value * value * value * value * value
      : 1 - Math.pow(-2 * value + 2, 5) / 2;

  return map(from, to, value);
}

// Exponential
export function easeInExpo(value: number, from = 0, to = 1) {
  value = value === 0 ? 0 : Math.pow(2, 10 * value - 10);

  return map(from, to, value);
}

export function easeOutExpo(value: number, from = 0, to = 1) {
  value = value === 1 ? 1 : 1 - Math.pow(2, -10 * value);

  return map(from, to, value);
}

export function easeInOutExpo(value: number, from = 0, to = 1) {
  value =
    value === 0
      ? 0
      : value === 1
        ? 1
        : value < 0.5
          ? Math.pow(2, 20 * value - 10) / 2
          : (2 - Math.pow(2, -20 * value + 10)) / 2;

  return map(from, to, value);
}

// Circular
export function easeInCirc(value: number, from = 0, to = 1) {
  value = 1 - Math.sqrt(1 - Math.pow(value, 2));

  return map(from, to, value);
}

export function easeOutCirc(value: number, from = 0, to = 1) {
  value = Math.sqrt(1 - Math.pow(value - 1, 2));

  return map(from, to, value);
}

export function easeInOutCirc(value: number, from = 0, to = 1) {
  value =
    value < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * value, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * value + 2, 2)) + 1) / 2;

  return map(from, to, value);
}

// Back
export function createEaseInBack(s = 1.70158): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    value = (s + 1) * value * value * value - s * value * value;

    return map(from, to, value);
  };
}

export function createEaseOutBack(s = 1.70158): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    value = 1 + (s + 1) * Math.pow(value - 1, 3) + s * Math.pow(value - 1, 2);

    return map(from, to, value);
  };
}

export function createEaseInOutBack(s = 1.70158, v = 1.525): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    value =
      value < 0.5
        ? (Math.pow(2 * value, 2) * ((s * v + 1) * 2 * value - s * v)) / 2
        : (Math.pow(2 * value - 2, 2) *
            ((s * v + 1) * (value * 2 - 2) + s * v) +
            2) /
          2;

    return map(from, to, value);
  };
}

// Elastic
export function createEaseInElastic(s = 2.094395): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    value =
      value === 0
        ? 0
        : value === 1
          ? 1
          : -Math.pow(2, 10 * value - 10) * Math.sin((value * 10 - 10.75) * s);

    return map(from, to, value);
  };
}

export function createEaseOutElastic(s = 2.094395): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    value =
      value === 0
        ? 0
        : value === 1
          ? 1
          : Math.pow(2, -10 * value) * Math.sin((value * 10 - 0.75) * s) + 1;

    return map(from, to, value);
  };
}

export function createEaseInOutElastic(s = 1.39626): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    value =
      value === 0
        ? 0
        : value === 1
          ? 1
          : value < 0.5
            ? -(
                Math.pow(2, 20 * value - 10) *
                Math.sin((20 * value - 11.125) * s)
              ) / 2
            : (Math.pow(2, -20 * value + 10) *
                Math.sin((20 * value - 11.125) * s)) /
                2 +
              1;

    return map(from, to, value);
  };
}

// Bounce
export function createEaseInBounce(n = 7.5625, d = 2.75): TimingFunction {
  const easeOutBounce = createEaseOutBounce(n, d);

  return (value: number, from = 0, to = 1) => {
    return 1 - easeOutBounce(1 - value, from, to);
  };
}

export function createEaseOutBounce(n = 7.5625, d = 2.75): TimingFunction {
  return (value: number, from = 0, to = 1) => {
    if (value < 1 / d) {
      value = n * value * value;
    } else if (value < 2 / d) {
      value = n * (value -= 1.505 / d) * value + 0.75;
    } else if (value < 2.5 / d) {
      value = n * (value -= 2.25 / d) * value + 0.9375;
    } else {
      value = n * (value -= 2.625 / d) * value + 0.984375;
    }

    return map(from, to, value);
  };
}

export function createEaseInOutBounce(n = 7.5625, d = 2.75): TimingFunction {
  const easeOutBounce = createEaseOutBounce(n, d);

  return (value: number, from = 0, to = 1) => {
    return value < 0.5
      ? (1 - easeOutBounce(1 - 2 * value, from, to)) / 2
      : (1 + easeOutBounce(2 * value - 1, from, to)) / 2;
  };
}

// Linear
export function linear(value: number, from = 0, to = 1) {
  return map(from, to, value);
}

// Cosine
export function cos(value: number, from = 0, to = 1) {
  return remap(-1, 1, from, to, Math.cos(value));
}

// Sensible defaults for functions with parameters that can be user defined
export const easeInBack: TimingFunction = createEaseInBack();
export const easeOutBack: TimingFunction = createEaseOutBack();
export const easeInOutBack: TimingFunction = createEaseInOutBack();

export const easeInBounce: TimingFunction = createEaseInBounce();
export const easeOutBounce: TimingFunction = createEaseOutBounce();
export const easeInOutBounce: TimingFunction = createEaseInOutBounce();

export const easeInElastic: TimingFunction = createEaseInElastic();
export const easeOutElastic: TimingFunction = createEaseOutElastic();
export const easeInOutElastic: TimingFunction = createEaseInOutElastic();
