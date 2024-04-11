import {InterpolationFunction, TimingFunction} from '../tweening';
import {PossibleVector2, Vector2} from '../types';
import {CompoundSignal, CompoundSignalContext} from './CompoundSignalContext';
import {Signal} from './SignalContext';
import {SignalExtensions, SignalValue} from './types';

export type Vector2Signal<
  TSetterValue,
  TValue extends TSetterValue,
  TKeys extends keyof TValue = keyof TValue,
  TOwner = void,
  TContext = Vector2CompoundSignalContext<TSetterValue, TValue, TKeys, TOwner>,
> = CompoundSignal<PossibleVector2, Vector2, 'x' | 'y', TOwner, TContext>;

export class Vector2CompoundSignalContext<
  TSetterValue,
  TValue extends TSetterValue,
  TKeys extends keyof TValue = keyof TValue,
  TOwner = void,
> extends CompoundSignalContext<TSetterValue, TValue, TKeys, TOwner> {
  public constructor(
    entries: (TKeys | [keyof TValue, Signal<any, any, TOwner>])[],
    parser: (value: TSetterValue) => TValue,
    initial: SignalValue<TSetterValue>,
    interpolation: InterpolationFunction<TValue>,
    owner: TOwner = <TOwner>(<unknown>undefined),
    extensions: Partial<SignalExtensions<TSetterValue, TValue>> = {},
  ) {
    super(entries, parser, initial, interpolation, owner, extensions);

    Object.defineProperty(this.invokable, 'add', {
      value: this.add.bind(this),
    });

    Object.defineProperty(this.invokable, 'edit', {
      value: this.edit.bind(this),
    });
  }

  public add(
    possibleVector: PossibleVector2,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<TValue>,
  ) {
    const newValue = this.invokable().add(possibleVector);
    return this.invoke(
      newValue,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }

  public edit(
    callback: (current: Vector2) => SignalValue<TValue>,
    duration?: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<TValue>,
  ) {
    const newValue = callback(this.invokable());
    return this.invoke(
      newValue,
      duration,
      timingFunction,
      interpolationFunction,
    );
  }
}
