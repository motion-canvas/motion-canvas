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

export type Length = number | `${number}%` | null;

export type PossibleCanvasStyle = null | PossibleColor | Gradient | Pattern;
export type CanvasStyle = null | Color | Gradient | Pattern;
