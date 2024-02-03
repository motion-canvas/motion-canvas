import {Color, ColorSpace, InterpolationMode, mix} from 'chroma-js';
import {Signal, SignalContext, SignalValue} from '../signals';
import type {InterpolationFunction} from '../tweening';
import type {Type, WebGLConvertible} from './Type';

export type SerializedColor = string;

export type PossibleColor =
  | SerializedColor
  | number
  | Color
  | {r: number; g: number; b: number; a: number};

export type ColorSignal<T> = Signal<PossibleColor, Color, T>;

declare module 'chroma-js' {
  interface Color extends Type, WebGLConvertible {
    serialize(): string;
    lerp(
      to: ColorInterface | string,
      value: number,
      colorSpace?: ColorSpace,
    ): ColorInterface;
  }
  type ColorInterface = import('chroma-js').Color;
  type ColorSpace = import('chroma-js').InterpolationMode;
  interface ColorStatic {
    symbol: symbol;
    lerp(
      from: ColorInterface | string | null,
      to: ColorInterface | string | null,
      value: number,
      colorSpace?: ColorSpace,
    ): ColorInterface;
    createLerp(colorSpace: ColorSpace): InterpolationFunction<ColorInterface>;
    createSignal(
      initial?: SignalValue<PossibleColor>,
      interpolation?: InterpolationFunction<ColorInterface>,
    ): ColorSignal<void>;
  }
  interface ChromaStatic {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Color: ColorStatic & (new (color: PossibleColor) => ColorInterface);
  }
}

/**
 * Represents a color.
 *
 * @remarks
 * This is the same class as the one created by
 * {@link https://gka.github.io/chroma.js/ | chroma.js}. Check out their
 * documentation for more information on how to use it.
 */
type ExtendedColor = Color;
// iife prevents tree shaking from stripping our methods.
const ExtendedColor: typeof Color = (() => {
  Color.symbol = Color.prototype.symbol = Symbol.for(
    '@motion-canvas/core/types/Color',
  );

  Color.lerp = Color.prototype.lerp = (
    from: Color | string | null,
    to: Color | string | null,
    value: number,
    colorSpace: InterpolationMode = 'lch',
  ) => {
    if (typeof from === 'string') {
      from = new Color(from);
    }
    if (typeof to === 'string') {
      to = new Color(to);
    }

    const fromIsColor = from instanceof Color;
    const toIsColor = to instanceof Color;

    if (!fromIsColor) {
      from = toIsColor ? (to as Color).alpha(0) : new Color('rgba(0, 0, 0, 0)');
    }
    if (!toIsColor) {
      to = fromIsColor
        ? (from as Color).alpha(0)
        : new Color('rgba(0, 0, 0, 0)');
    }

    return mix(from as Color, to as Color, value, colorSpace);
  };

  Color.createLerp = Color.prototype.createLerp =
    (colorSpace: InterpolationMode) =>
    (from: Color | string | null, to: Color | string | null, value: number) =>
      Color.lerp(from, to, value, colorSpace);

  Color.createSignal = (
    initial?: SignalValue<PossibleColor>,
    interpolation: InterpolationFunction<Color> = Color.lerp,
  ): ColorSignal<void> => {
    return new SignalContext(
      initial,
      interpolation,
      undefined,
      value => new Color(value),
    ).toSignal();
  };

  Color.prototype.toSymbol = () => {
    return Color.symbol;
  };

  Color.prototype.toUniform = function (
    this: Color,
    gl: WebGL2RenderingContext,
    location: WebGLUniformLocation,
  ): void {
    gl.uniform4fv(location, this.gl());
  };

  Color.prototype.serialize = function (this: Color): SerializedColor {
    return this.css();
  };

  Color.prototype.lerp = function (
    this: Color,
    to: Color,
    value: number,
    colorSpace?: ColorSpace,
  ) {
    return Color.lerp(this, to, value, colorSpace);
  };

  return Color;
})();

export {ExtendedColor as Color};
