import {PossibleSpacing, Spacing} from '@motion-canvas/core/lib/types';
import {Property, wrapper} from './property';
import {compound} from './compound';
import {Signal} from '@motion-canvas/core/lib/utils';

export type SpacingProperty<T> = Property<PossibleSpacing, Spacing, T> & {
  top: Signal<number, T>;
  right: Signal<number, T>;
  bottom: Signal<number, T>;
  left: Signal<number, T>;
};

export function spacingProperty(prefix?: string): PropertyDecorator {
  return (target, key) => {
    compound({
      top: prefix ? `${prefix}Top` : 'top',
      right: prefix ? `${prefix}Right` : 'right',
      bottom: prefix ? `${prefix}Bottom` : 'bottom',
      left: prefix ? `${prefix}Left` : 'left',
    })(target, key);
    wrapper(Spacing)(target, key);
  };
}
