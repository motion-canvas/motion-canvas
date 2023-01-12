import {SignalValue} from './types';

export function isReactive<T>(value: SignalValue<T>): value is () => T {
  return typeof value === 'function';
}
