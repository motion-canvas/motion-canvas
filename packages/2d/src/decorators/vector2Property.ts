import {PossibleVector2, Vector2} from '@motion-canvas/core/lib/types';
import {Property, wrapper} from './property';
import {compound} from './compound';
import {Signal} from '@motion-canvas/core/lib/utils';
import {Length} from '../partials';

export type Vector2Property<T> = Property<PossibleVector2, Vector2, T> & {
  x: Signal<number, T>;
  y: Signal<number, T>;
};

export type Vector2LengthProperty<TOwner> = Property<
  PossibleVector2<Length>,
  Vector2,
  TOwner
> & {
  x: Property<Length, number, TOwner>;
  y: Property<Length, number, TOwner>;
};

export function vector2Property(prefix?: string): PropertyDecorator {
  return (target, key) => {
    compound({
      x: prefix ? `${prefix}X` : 'x',
      y: prefix ? `${prefix}Y` : 'y',
    })(target, key);
    wrapper(Vector2)(target, key);
  };
}
