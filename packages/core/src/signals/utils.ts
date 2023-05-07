import {SignalValue} from './types';

export function isReactive<T>(value: SignalValue<T>): value is () => T {
  return typeof value === 'function';
}

export function modify<TFrom, TTo>(
  value: SignalValue<TFrom>,
  modification: (value: TFrom) => TTo,
): SignalValue<TTo> {
  return isReactive(value) ? () => modification(value()) : modification(value);
}

export function unwrap<T>(value: SignalValue<T>): T {
  return isReactive(value) ? value() : value;
}
