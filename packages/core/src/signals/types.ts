import type {ThreadGenerator} from '../threading';
import type {InterpolationFunction, TimingFunction} from '../tweening';
import {DEFAULT} from './symbols';

export type SignalValue<TValue> = TValue | (() => TValue);
export type SignalGenerator<
  TSetterValue,
  TValue extends TSetterValue,
> = ThreadGenerator & {
  /**
   * Tween to the specified value.
   */
  to: SignalTween<TSetterValue, TValue>;
  /**
   * Tween back to the original value.
   *
   * @param time - The duration of the tween.
   * @param timingFunction - The timing function of the tween.
   * @param interpolationFunction - The interpolation function of the tween.
   */
  back: (
    time: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<TValue>,
  ) => SignalGenerator<TSetterValue, TValue>;
  /**
   * Wait for the specified duration.
   *
   * @param duration - The duration to wait.
   */
  wait: (duration: number) => SignalGenerator<TSetterValue, TValue>;
  /**
   * Run the given task.
   *
   * @param task - The generator to run.
   */
  run: (task: ThreadGenerator) => SignalGenerator<TSetterValue, TValue>;
  /**
   * Invoke the given callback.
   *
   * @param callback - The callback to invoke.
   */
  do: (callback: () => void) => SignalGenerator<TSetterValue, TValue>;
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
