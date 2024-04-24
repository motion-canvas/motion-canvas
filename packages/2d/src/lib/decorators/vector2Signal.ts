import {
  PossibleVector2,
  Signal,
  Vector2,
  Vector2SignalContext,
} from '@motion-canvas/core';
import type {Length} from '../partials';
import {compound} from './compound';
import {wrapper} from './signal';

export type Vector2LengthSignal<TOwner> = Signal<
  PossibleVector2<Length>,
  Vector2,
  TOwner
> & {
  x: Signal<Length, number, TOwner>;
  y: Signal<Length, number, TOwner>;
};

export function vector2Signal(
  prefix?: string | Record<string, string>,
): PropertyDecorator {
  return (target, key) => {
    compound(
      typeof prefix === 'object'
        ? prefix
        : {
            x: prefix ? `${prefix}X` : 'x',
            y: prefix ? `${prefix}Y` : 'y',
          },
      Vector2SignalContext,
    )(target, key);
    wrapper(Vector2)(target, key);
  };
}
