import {InterpolationFunction} from '../tweening';
import {Signal, SignalContext} from './SignalContext';
import {SignalValue} from './types';

export type SimpleInheritedSignal<TValue, TOwner = void> = InheritedSignal<
  TValue,
  TValue,
  TOwner
>;

export interface InheritedSignal<
  TSetterValue,
  TValue extends TSetterValue,
  TOwner = void,
> extends Signal<
    TSetterValue,
    TValue,
    TOwner,
    InheritedSignalContext<TSetterValue, TValue, TOwner>
  > {
  isInheriting(): boolean;
}

export class InheritedSignalContext<
  TSetterValue,
  TValue extends TSetterValue = TSetterValue,
  TOwner = void,
> extends SignalContext<TSetterValue, TValue, TOwner> {
  private compute?: () => TValue;

  public constructor(
    initial: SignalValue<TSetterValue>,
    interpolation: InterpolationFunction<TValue, any[]>,
    owner?: TOwner,
  ) {
    super(initial, interpolation, owner);
    Object.defineProperty(this.invokable, 'isInheriting', {
      value: this.isInheriting.bind(this),
    });
  }

  public setCompute(value: () => TValue) {
    this.compute = value;
  }

  public override toSignal(): InheritedSignal<TSetterValue, TValue, TOwner> {
    return this.invokable;
  }

  public isInheriting() {
    this.event.reset();
    this.collect();
    return this.current === this.compute;
  }
}
