import {InterpolationFunction, map} from '../tweening';
import {Signal, SignalContext} from './SignalContext';
import {SignalValue} from './types';
import {isReactive} from './isReactive';

export type CompoundSignal<
  TSetterValue,
  TValue extends TSetterValue,
  TKeys extends keyof TValue,
  TOwner,
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
  TKeys extends keyof TValue,
  TOwner = void,
> extends SignalContext<TSetterValue, TValue, TOwner> {
  public readonly signals: [keyof TValue, Signal<any, any, TOwner>][] = [];

  public constructor(
    private readonly entries: TKeys[],
    parser: (value: TSetterValue) => TValue,
    initial: SignalValue<TSetterValue>,
    interpolation: InterpolationFunction<TValue>,
    owner: TOwner = <TOwner>(<unknown>undefined),
  ) {
    super(undefined, interpolation, owner);
    this.parser = parser;

    for (const key of entries) {
      const signal = new SignalContext(
        isReactive(initial)
          ? () => parser(initial())[key]
          : parser(initial)[key],
        <any>map,
        owner ?? this.invokable,
      ).toSignal();
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

  public override get(): TValue {
    return this.parse(
      <TSetterValue>(
        Object.fromEntries(
          this.signals.map(([key, property]) => [key, property()]),
        )
      ),
    );
  }

  public override set(value: SignalValue<TValue>): TOwner {
    if (isReactive(value)) {
      for (const [key, property] of this.signals) {
        property(() => value()[key]);
      }
    } else {
      for (const [key, property] of this.signals) {
        property(value[key]);
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
}
