import {Color, Signal} from '@motion-canvas/core';
import type {CanvasStyle, PossibleCanvasStyle} from '../partials';
import {canvasStyleParser} from '../utils';
import {initial, interpolation, parser, signal} from './signal';

export type CanvasStyleSignal<T> = Signal<PossibleCanvasStyle, CanvasStyle, T>;

export function canvasStyleSignal(): PropertyDecorator {
  return (target, key) => {
    signal()(target, key);
    parser(canvasStyleParser)(target, key);
    interpolation(Color.lerp)(target, key);
    initial(null)(target, key);
  };
}
