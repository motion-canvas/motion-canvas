import {Color, ColorSpace, InterpolationMode, mix} from 'chroma-js';
import type {Type} from './Type';
import type {InterpolationFunction} from '../tweening';
import {Signal, SignalContext, SignalValue} from '../signals';

export type SerializedColor = string;

export type PossibleColor =
  | SerializedColor
  | number
  | Color
  | {r: number; g: number; b: number; a: number};

export type ColorSignal<T> = Signal<PossibleColor, Color, T>;

declare module 'chroma-js' {
  interface Color extends Type {
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
      from: ColorInterface | string,
      to: ColorInterface | string,
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
    Color: ColorStatic & (new (color: PossibleColor) => ColorInterface);
  }
}

Color.symbol = Color.prototype.symbol = Symbol.for(
  '@motion-canvas/core/types/Color',
);

Color.lerp = Color.prototype.lerp = (
  from: Color | string,
  to: Color | string,
  value: number,
  colorSpace: InterpolationMode = 'lch',
) => {
  return mix(from, to, value, colorSpace);
};

Color.createLerp = Color.prototype.createLerp =
  (colorSpace: InterpolationMode) =>
  (from: Color | string, to: Color | string, value: number) =>
    mix(from, to, value, colorSpace);

Color.createSignal = (
  initial?: SignalValue<PossibleColor>,
  interpolation: InterpolationFunction<Color> = Color.lerp,
): ColorSignal<void> => {
  const context = new SignalContext(initial, interpolation);
  context.setParser(value => new Color(value));
  return context.toSignal();
};

Color.prototype.toSymbol = () => {
  return Color.symbol;
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

export {Color};
