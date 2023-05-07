import type {InterpolationFunction, TimingFunction} from '../tweening';
import type {ThreadGenerator} from '../threading';
import {DEFAULT} from './symbols';

export type SignalValue<TValue> = TValue | (() => TValue);
export type SignalGenerator<
  TSetterValue,
  TValue extends TSetterValue,
> = ThreadGenerator & {
  to: SignalTween<TSetterValue, TValue>;
};

export interface SignalSetter<TValue, TOwner = void> {
  (value: SignalValue<TValue> | typeof DEFAULT): TOwner;
}

export interface SignalGetter<TValue> {
  (): TValue;
}

export interface SignalTween<TSetterValue, TValue extends TSetterValue> {
  (
    value: SignalValue<TSetterValue> | typeof DEFAULT,
    time: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<TValue>,
  ): SignalGenerator<TSetterValue, TValue>;
}

export interface SignalExtensions<TSetterValue, TValue extends TSetterValue> {
  getter: SignalGetter<TValue>;
  setter: SignalSetter<TSetterValue>;
  tweener(
    value: SignalValue<TSetterValue>,
    time: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<TValue>,
  ): ThreadGenerator;
}
