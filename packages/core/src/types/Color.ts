import type {Color as ChromaColor} from 'chroma-js';
import chroma from 'chroma-js';
import {Signal, SignalContext, SignalValue} from '../signals';
import type {InterpolationFunction} from '../tweening';
import type {Type, WebGLConvertible} from './Type';

export type SerializedColor = string;

export type PossibleColor =
  | SerializedColor
  | number
  | ChromaColor
  | {r: number; g: number; b: number; a: number};

export type ColorSignal<T> = Signal<PossibleColor, Color, T>;

/**
 * The color spaces supported by chroma.js for interpolation.
 */
type ColorSpace =
  | 'hcl'
  | 'hsi'
  | 'hsl'
  | 'hsv'
  | 'lab'
  | 'lch'
  | 'lrgb'
  | 'oklab'
  | 'oklch'
  | 'rgb';

/**
 * Represents a color.
 *
 * @remarks
 * This is the same class as the one created by
 * {@link https://gka.github.io/chroma.js/ | chroma.js}. Check out their
 * documentation for more information on how to use it.
 *
 * The chainable methods inherited from chroma.js are redeclared here so that
 * they return {@link Color} and can be combined with motion-canvas' own
 * methods.
 */
export interface Color extends ChromaColor, Type, WebGLConvertible {
  symbol: symbol;
  alpha(): number;
  alpha(value: number): Color;
  darken(...args: Parameters<ChromaColor['darken']>): Color;
  brighten(...args: Parameters<ChromaColor['brighten']>): Color;
  saturate(...args: Parameters<ChromaColor['saturate']>): Color;
  desaturate(...args: Parameters<ChromaColor['desaturate']>): Color;
  mix(...args: Parameters<ChromaColor['mix']>): Color;
  shade: (...args: Parameters<ChromaColor['shade']>) => Color;
  tint: (...args: Parameters<ChromaColor['tint']>) => Color;
  set(...args: Parameters<ChromaColor['set']>): Color;
  luminance(): number;
  luminance(...args: Parameters<ChromaColor['luminance']>): Color;
  createLerp(colorSpace: ColorSpace): InterpolationFunction<Color>;
  serialize(): string;
  lerp(to: Color | string, value: number, colorSpace?: ColorSpace): Color;
}

interface ColorStatic {
  prototype: Color;
  symbol: symbol;
  new (color: PossibleColor): Color;
  lerp(
    from: Color | string | null,
    to: Color | string | null,
    value: number,
    colorSpace?: ColorSpace,
  ): Color;
  createLerp(colorSpace: ColorSpace): InterpolationFunction<Color>;
  createSignal(
    initial?: SignalValue<PossibleColor>,
    interpolation?: InterpolationFunction<Color>,
  ): ColorSignal<void>;
}

// iife prevents tree shaking from stripping our methods.
export const Color: ColorStatic = (() => {
  const ColorClass = (
    chroma as typeof chroma & {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Color: ColorStatic;
    }
  ).Color;

  ColorClass.symbol = ColorClass.prototype.symbol = Symbol.for(
    '@motion-canvas/core/types/Color',
  );

  ColorClass.lerp = (
    from: Color | string | null,
    to: Color | string | null,
    value: number,
    colorSpace: ColorSpace = 'lch',
  ) => {
    if (typeof from === 'string') {
      from = new ColorClass(from);
    }
    if (typeof to === 'string') {
      to = new ColorClass(to);
    }

    const fromIsColor = from instanceof ColorClass;
    const toIsColor = to instanceof ColorClass;

    if (!fromIsColor) {
      from = toIsColor
        ? (to as Color).alpha(0)
        : new ColorClass('rgba(0, 0, 0, 0)');
    }
    if (!toIsColor) {
      to = fromIsColor
        ? (from as Color).alpha(0)
        : new ColorClass('rgba(0, 0, 0, 0)');
    }

    return chroma.mix(from as Color, to as Color, value, colorSpace) as Color;
  };

  ColorClass.createLerp =
    (colorSpace: ColorSpace) =>
    (from: Color | string | null, to: Color | string | null, value: number) =>
      ColorClass.lerp(from, to, value, colorSpace);

  ColorClass.prototype.createLerp = ColorClass.createLerp;

  ColorClass.createSignal = (
    initial?: SignalValue<PossibleColor>,
    interpolation: InterpolationFunction<Color> = ColorClass.lerp,
  ): ColorSignal<void> => {
    return new SignalContext(
      initial,
      interpolation,
      undefined,
      value => new ColorClass(value),
    ).toSignal();
  };

  ColorClass.prototype.toSymbol = () => {
    return ColorClass.symbol;
  };

  ColorClass.prototype.toUniform = function (
    this: Color,
    gl: WebGL2RenderingContext,
    location: WebGLUniformLocation,
  ): void {
    gl.uniform4fv(location, this.gl());
  };

  ColorClass.prototype.serialize = function (this: Color): SerializedColor {
    return this.css();
  };

  ColorClass.prototype.lerp = function (
    this: Color,
    to: Color,
    value: number,
    colorSpace?: ColorSpace,
  ) {
    return ColorClass.lerp(this, to, value, colorSpace);
  };

  return ColorClass;
})();
