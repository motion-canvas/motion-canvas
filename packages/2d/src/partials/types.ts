import type {Gradient} from './Gradient';
import type {Pattern} from './Pattern';
import {Color, PossibleColor} from '@motion-canvas/core/lib/types';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export type FlexBasis =
  | Length
  | 'content'
  | 'max-content'
  | 'min-content'
  | 'fit-content'
  | null;

export type FlexJustify =
  | 'normal'
  | 'center'
  | 'start'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'stretch';

export type FlexAlign =
  | 'normal'
  | 'center'
  | 'start'
  | 'end'
  | 'stretch'
  | 'baseline';

export type TextWrap = boolean | 'pre' | null;

export type LayoutMode = boolean | null;

/**
 * Represents a length used by most layout properties.
 *
 * @remarks
 * The value can be either:
 * - `number` - the desired length in pixels
 * - `${number}%` - a string with the desired length in percents, for example
 *                  `'50%'`
 * - `null` - an automatic length (equivalent to `auto` in CSS)
 */
export type Length = number | `${number}%` | null;

export type PossibleCanvasStyle = null | PossibleColor | Gradient | Pattern;
export type CanvasStyle = null | Color | Gradient | Pattern;
