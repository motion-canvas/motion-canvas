import type {InterpolationFunction, TimingFunction} from '../tweening';
import type {ThreadGenerator} from '../threading';

export type SignalValue<TValue> = TValue | (() => TValue);
export type SignalGenerator<
  TSetterValue,
  TValue extends TSetterValue,
> = ThreadGenerator & {
  to: SignalTween<TSetterValue, TValue>;
};

export interface SignalSetter<TValue, TOwner = void> {
  (value: SignalValue<TValue>): TOwner;
}

export interface SignalGetter<TValue> {
  (): TValue;
}

export interface SignalTween<TSetterValue, TValue extends TSetterValue> {
  (
    value: SignalValue<TSetterValue>,
    time: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<TValue>,
  ): SignalGenerator<TSetterValue, TValue>;
}
