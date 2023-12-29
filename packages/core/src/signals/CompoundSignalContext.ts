import {InterpolationFunction, map} from '../tweening';
import {Signal, SignalContext} from './SignalContext';
import {SignalExtensions, SignalValue} from './types';
import {isReactive, modify} from './utils';

export type CompoundSignal<
  TSetterValue,
  TValue extends TSetterValue,
  TKeys extends keyof TValue = keyof TValue,
  TOwner = void,
  TContext = CompoundSignalContext<TSetterValue, TValue, TKeys, TOwner>,
> = Signal<TSetterValue, TValue, TOwner, TContext> & {
  [K in TKeys]: Signal<
    TValue[K],
    TValue[K],
    TOwner extends void
      ? CompoundSignal<TSetterValue, TValue, TKeys, TOwner, TContext>
      : TOwner
  >;
};

export class CompoundSignalContext<
  TSetterValue,
  TValue extends TSetterValue,
  TKeys extends keyof TValue = keyof TValue,
  TOwner = void,
> extends SignalContext<TSetterValue, TValue, TOwner> {
  public readonly signals: [keyof TValue, Signal<any, any, TOwner>][] = [];

  public constructor(
    private readonly entries: (
      | TKeys
      | [keyof TValue, Signal<any, any, TOwner>]
    )[],
    parser: (value: TSetterValue) => TValue,
    initial: SignalValue<TSetterValue>,
    interpolation: InterpolationFunction<TValue>,
    owner: TOwner = <TOwner>(<unknown>undefined),
    extensions: Partial<SignalExtensions<TSetterValue, TValue>> = {},
  ) {
    super(undefined, interpolation, owner, parser, extensions);
    this.parser = parser;

    for (const entry of entries) {
      let key: keyof TValue;
      let signal: Signal<any, any, TOwner>;
      if (Array.isArray(entry)) {
        [key, signal] = entry;
        (signal.context as any).owner ??= this;
      } else {
        key = entry;
        signal = new SignalContext(
          modify(initial, value => parser(value)[entry]),
          <any>map,
          owner ?? this.invokable,
        ).toSignal();
      }
      this.signals.push([key, signal]);
      Object.defineProperty(this.invokable, key, {value: signal});
    }
  }

  public override toSignal(): CompoundSignal<
    TSetterValue,
    TValue,
    TKeys,
    TOwner
  > {
    return this.invokable;
  }

  public override parse(value: TSetterValue): TValue {
    return this.parser(value);
  }

  public override getter(): TValue {
    return this.parse(
      <TSetterValue>(
        Object.fromEntries(
          this.signals.map(([key, property]) => [key, property()]),
        )
      ),
    );
  }

  public override setter(value: SignalValue<TValue>): TOwner {
    if (isReactive(value)) {
      for (const [key, property] of this.signals) {
        property(() => this.parser(value())[key]);
      }
    } else {
      const parsed = this.parse(value);
      for (const [key, property] of this.signals) {
        property(parsed[key]);
      }
    }

    return this.owner;
  }

  public override reset(): TOwner {
    for (const [, signal] of this.signals) {
      signal.reset();
    }
    return this.owner;
  }

  public override save(): TOwner {
    for (const [, signal] of this.signals) {
      signal.save();
    }
    return this.owner;
  }

  public override isInitial(): boolean {
    for (const [, signal] of this.signals) {
      if (!signal.isInitial()) {
        return false;
      }
    }
    return true;
  }

  public override raw() {
    return Object.fromEntries(
      this.signals.map(([key, property]) => [key, property.context.raw()]),
    ) as TSetterValue;
  }
}
