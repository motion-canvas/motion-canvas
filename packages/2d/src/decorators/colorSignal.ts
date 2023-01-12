import {Color} from '@motion-canvas/core/lib/types';
import {signal, wrapper} from './signal';

export function colorSignal(): PropertyDecorator {
  return (target, key) => {
    signal()(target, key);
    wrapper(Color)(target, key);
  };
}
