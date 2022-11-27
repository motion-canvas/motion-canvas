import {Color, PossibleColor} from '@motion-canvas/core/lib/types';
import {property, Property, wrapper} from './property';

export type ColorProperty<T> = Property<PossibleColor, Color, T>;

export function colorProperty(): PropertyDecorator {
  return (target, key) => {
    property()(target, key);
    wrapper(Color)(target, key);
  };
}
