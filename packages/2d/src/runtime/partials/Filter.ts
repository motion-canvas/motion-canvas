import {
  createSignal,
  map,
  SignalValue,
  SimpleSignal,
  transformScalar,
} from '@motion-canvas/core';

/**
 * All possible CSS filter names.
 *
 * @internal
 */
export type FilterName =
  | 'invert'
  | 'sepia'
  | 'grayscale'
  | 'brightness'
  | 'contrast'
  | 'saturate'
  | 'hue'
  | 'blur';

/**
 * Definitions of all possible CSS filters.
 *
 * @internal
 */
export const FILTERS: Record<string, Partial<FilterProps>> = {
  invert: {
    name: 'invert',
  },
  sepia: {
    name: 'sepia',
  },
  grayscale: {
    name: 'grayscale',
  },
  brightness: {
    name: 'brightness',
    default: 1,
  },
  contrast: {
    name: 'contrast',
    default: 1,
  },
  saturate: {
    name: 'saturate',
    default: 1,
  },
  hue: {
    name: 'hue-rotate',
    unit: 'deg',
    scale: 1,
  },
  blur: {
    name: 'blur',
    transform: true,
    unit: 'px',
    scale: 1,
  },
};

/**
 * A unified abstraction for all CSS filters.
 */
export interface FilterProps {
  name: string;
  value: SignalValue<number>;
  unit: string;
  scale: number;
  transform: boolean;
  default: number;
}

export class Filter {
  public get name() {
    return this.props.name;
  }

  public get default() {
    return this.props.default;
  }

  public readonly value: SimpleSignal<number, Filter>;
  private readonly props: FilterProps;

  public constructor(props: Partial<FilterProps>) {
    this.props = {
      name: 'invert',
      default: 0,
      unit: '%',
      scale: 100,
      transform: false,
      ...props,
      value: props.value ?? props.default ?? 0,
    };
    this.value = createSignal(this.props.value, map, this);
  }

  public isActive() {
    return this.value() !== this.props.default;
  }

  public serialize(matrix: DOMMatrix): string {
    let value = this.value();
    if (this.props.transform) {
      value = transformScalar(value, matrix);
    }

    return `${this.props.name}(${value * this.props.scale}${this.props.unit})`;
  }
}

/**
 * Create an {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert | invert} filter.
 *
 * @param value - The value of the filter.
 */
export function invert(value?: SignalValue<number>) {
  return new Filter({...FILTERS.invert, value});
}

/**
 * Create a {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/sepia | sepia} filter.
 *
 * @param value - The value of the filter.
 */
export function sepia(value?: SignalValue<number>) {
  return new Filter({...FILTERS.sepia, value});
}

/**
 * Create a {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/grayscale | grayscale} filter.
 *
 * @param value - The value of the filter.
 */
export function grayscale(value?: SignalValue<number>) {
  return new Filter({...FILTERS.grayscale, value});
}

/**
 * Create a {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/brightness | brightness} filter.
 *
 * @param value - The value of the filter.
 */
export function brightness(value?: SignalValue<number>) {
  return new Filter({...FILTERS.brightness, value});
}

/**
 * Create a {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/contrast | contrast} filter.
 *
 * @param value - The value of the filter.
 */
export function contrast(value?: SignalValue<number>) {
  return new Filter({...FILTERS.contrast, value});
}

/**
 * Create a {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/saturate | saturate} filter.
 *
 * @param value - The value of the filter.
 */
export function saturate(value?: SignalValue<number>) {
  return new Filter({...FILTERS.saturate, value});
}

/**
 * Create a {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/hue-rotate | hue} filter.
 *
 * @param value - The value of the filter in degrees.
 */
export function hue(value?: SignalValue<number>) {
  return new Filter({...FILTERS.hue, value});
}

/**
 * Create a {@link https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur | blur} filter.
 *
 * @param value - The value of the filter in pixels.
 */
export function blur(value?: SignalValue<number>) {
  return new Filter({...FILTERS.blur, value});
}
