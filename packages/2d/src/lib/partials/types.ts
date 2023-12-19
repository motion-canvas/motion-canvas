import {Color, PossibleColor} from '@motion-canvas/core';
import type {Gradient} from './Gradient';
import type {Pattern} from './Pattern';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export type FlexBasis =
  | Length
  | 'content'
  | 'max-content'
  | 'min-content'
  | 'fit-content'
  | null;

export type FlexContent =
  | 'center'
  | 'start'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'stretch';

export type FlexItems = 'center' | 'start' | 'end' | 'stretch' | 'baseline';

export type TextWrap = boolean | 'pre';

export type LayoutMode = boolean | null;

/**
 * Represents a length used by most layout properties.
 *
 * @remarks
 * The value can be either:
 * - `number` - the desired length in pixels
 * - `${number}%` - a string with the desired length in percents, for example
 *                  `'50%'`
 */
export type Length = number | `${number}%`;

/**
 * Represents a desired length used internally by layout Nodes.
 *
 * @remarks
 * When the desired length is set to `null` it represents a default value for
 * whatever property it describes.
 */
export type DesiredLength = Length | null;

/**
 * Represents a length limit used by layout properties such as `max-width`.
 */
export type LengthLimit = Length | null | 'max-content' | 'min-content';

export type PossibleCanvasStyle = null | PossibleColor | Gradient | Pattern;
export type CanvasStyle = null | Color | Gradient | Pattern;
