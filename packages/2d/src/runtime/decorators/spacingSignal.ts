import {Spacing} from '@motion-canvas/core';
import {compound} from './compound';
import {wrapper} from './signal';

export function spacingSignal(prefix?: string): PropertyDecorator {
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
