import {PossibleVector2, Vector2} from '@motion-canvas/core/lib/types/Vector';
import {compound} from './compound';
import type {Length} from '../partials';
import {wrapper} from './signal';
import {Signal} from '@motion-canvas/core/lib/signals';

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
    )(target, key);
    wrapper(Vector2)(target, key);
  };
}
