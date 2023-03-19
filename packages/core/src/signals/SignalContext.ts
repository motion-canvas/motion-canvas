import {
  easeInOutCubic,
  InterpolationFunction,
  TimingFunction,
  tween,
} from '../tweening';
import {waitFor} from '../flow';
import {errorToLog, useLogger} from '../utils';
import {ThreadGenerator} from '../threading';
import {run} from '../flow';
import {DependencyContext} from './DependencyContext';
import {
  SignalGenerator,
  SignalGetter,
  SignalSetter,
  SignalTween,
  SignalValue,
  SignalWait,
} from './types';
import {isReactive} from './isReactive';
import {DEFAULT} from './symbols';

export type SimpleSignal<TValue, TReturn = void> = Signal<
  TValue,
  TValue,
  TReturn
>;

export interface Signal<
  TSetterValue,
  TValue extends TSetterValue,
  TOwner = void,
  TContext = SignalContext<TSetterValue, TValue, TOwner>,
> extends SignalSetter<TSetterValue, TOwner>,
    SignalGetter<TValue>,
    SignalTween<TSetterValue, TValue>,
    SignalWait<TSetterValue, TValue> {
  /**
   * {@inheritDoc SignalContext.reset}
   */
  reset(): TOwner;

  /**
   * {@inheritDoc SignalContext.save}
   */
  save(): TOwner;

  /**
   * {@inheritDoc SignalContext.isInitial}
   */
  isInitial(): boolean;

  context: TContext;
}

export class SignalContext<
  TSetterValue,
  TValue extends TSetterValue = TSetterValue,
  TOwner = void,
> extends DependencyContext<TOwner> {
  protected current: SignalValue<TSetterValue> | undefined;
  protected last: TValue | undefined;
  protected parser: (value: TSetterValue) => TValue = value => <TValue>value;

  public constructor(
    private initial: SignalValue<TSetterValue> | undefined,
    private readonly interpolation: InterpolationFunction<TValue>,
    owner: TOwner = <TOwner>(<unknown>undefined),
  ) {
    super(owner);

    Object.defineProperty(this.invokable, 'reset', {
      value: this.reset.bind(this),
    });
    Object.defineProperty(this.invokable, 'save', {
      value: this.save.bind(this),
    });
    Object.defineProperty(this.invokable, 'isInitial', {
      value: this.isInitial.bind(this),
    });

    if (this.initial !== undefined) {
      this.current = this.initial;
      this.markDirty();

      if (!isReactive(this.initial)) {
        this.last = this.parse(this.initial);
      }
    }
  }

  public toSignal(): Signal<TSetterValue, TValue, TOwner> {
    return this.invokable;
  }

  public parse(value: TSetterValue): TValue {
    return this.parser(value);
  }

  protected wrap(value: SignalValue<TSetterValue>): SignalValue<TValue> {
    return isReactive(value) ? () => this.parse(value()) : this.parse(value);
  }

  public setInitial(value: SignalValue<TSetterValue>) {
    this.initial = value;
  }

  public setParser(value: (value: TSetterValue) => TValue) {
    this.parser = value;
    if (this.current !== undefined && !isReactive(this.current)) {
      this.last = this.parse(this.current);
    }
    this.markDirty();
  }

  public set(value: SignalValue<TSetterValue> | typeof DEFAULT): TOwner {
    if (value === DEFAULT) {
      value = this.initial!;
    }

    if (this.current === value) {
      return this.owner;
    }

    this.current = value;
    this.markDirty();
    this.clearDependencies();

    if (!isReactive(value)) {
      this.last = this.parse(value);
    }

    return this.owner;
  }

  public get(): TValue {
    if (this.event.isRaised() && isReactive(this.current)) {
      this.clearDependencies();
      this.startCollecting();
      try {
        this.last = this.parse(this.current());
      } catch (e: any) {
        useLogger().error({
          ...errorToLog(e),
          inspect: (<any>this.owner)?.key,
        });
      }
      this.finishCollecting();
    }
    this.event.reset();
    this.collect();

    return this.last!;
  }

  protected override invoke(
    value?: SignalValue<TSetterValue> | typeof DEFAULT,
    duration?: number,
    timingFunction: TimingFunction = easeInOutCubic,
    interpolationFunction: InterpolationFunction<TValue> = this.interpolation,
  ) {
    if (value === undefined) {
      return this.get();
    }

    if (duration === undefined) {
      return this.set(value);
    }

    return this.makeAnimate(timingFunction, interpolationFunction)(
      value,
      duration,
    );
  }

  protected makeAnimate(
    defaultTimingFunction: TimingFunction,
    defaultInterpolationFunction: InterpolationFunction<TValue>,
    before?: ThreadGenerator,
  ) {
    const animate = (
      value: SignalValue<TSetterValue> | typeof DEFAULT,
      duration: number,
      timingFunction = defaultTimingFunction,
      interpolationFunction = defaultInterpolationFunction,
    ) => {
      const tween = this.tween(
        value,
        duration,
        timingFunction,
        interpolationFunction,
      ) as SignalGenerator<TSetterValue, TValue>;
      let task = tween;
      if (before) {
        task = run(function* () {
          yield* before;
          yield* tween;
        }) as SignalGenerator<TSetterValue, TValue>;
      }
      task.to = this.makeAnimate(timingFunction, interpolationFunction, task);
      task.wait = this.makeStay(timingFunction, interpolationFunction, task);
      return task;
    };

    return <SignalTween<TSetterValue, TValue>>animate;
  }

  protected makeStay(
    defaultTimingFunction: TimingFunction,
    defaultInterpolationFunction: InterpolationFunction<TValue>,
    before: ThreadGenerator,
  ) {
    const stay = (
      duration: number,
      timingFunction = defaultTimingFunction,
      interpolationFunction = defaultInterpolationFunction,
    ) => {
      const wait = this.wait(duration) as SignalGenerator<TSetterValue, TValue>;
      const task = run(function* () {
        yield* before;
        yield* wait;
      }) as SignalGenerator<TSetterValue, TValue>;
      task.to = this.makeAnimate(timingFunction, interpolationFunction, task);
      task.wait = this.makeStay(timingFunction, interpolationFunction, task);
      return task;
    };

    return <SignalWait<TSetterValue, TValue>>stay;
  }

  protected *tween(
    value: SignalValue<TSetterValue> | typeof DEFAULT,
    duration: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<TValue>,
  ): ThreadGenerator {
    if (value === DEFAULT) {
      value = this.initial!;
    }

    yield* this.doTween(
      this.parse(isReactive(value) ? value() : value),
      duration,
      timingFunction,
      interpolationFunction,
    );
    this.set(value);
  }

  protected *wait(duration: number): ThreadGenerator {
    yield* waitFor(duration);
  }

  public *doTween(
    value: TValue,
    duration: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<TValue>,
  ): ThreadGenerator {
    const from = this.get();
    yield* tween(duration, v => {
      this.set(interpolationFunction(from, value, timingFunction(v)));
    });
  }

  public override dispose() {
    super.dispose();
    this.initial = undefined;
    this.current = undefined;
    this.last = undefined;
  }

  /**
   * Reset the signal to its initial value (if one has been set).
   *
   * @example
   * ```ts
   * const signal = createSignal(7);
   *
   * signal.reset();
   * // same as:
   * signal(7);
   * ```
   */
  public reset() {
    if (this.initial !== undefined) {
      this.set(this.initial);
    }
    return this.owner;
  }

  /**
   * Compute the current value of the signal and immediately set it.
   *
   * @remarks
   * This method can be used to stop the signal from updating while keeping its
   * current value.
   *
   * @example
   * ```ts
   * signal.save();
   * // same as:
   * signal(signal());
   * ```
   */
  public save() {
    return this.set(this.get());
  }

  /**
   * Check if the signal is currently using its initial value.
   *
   * @example
   * ```ts
   *
   * const signal = createSignal(0);
   * signal.isInitial(); // true
   *
   * signal(5);
   * signal.isInitial(); // false
   *
   * signal(DEFAULT);
   * signal.isInitial(); // true
   * ```
   */
  public isInitial() {
    this.collect();
    return this.current === this.initial;
  }

  /**
   * Get the raw value of this signal.
   *
   * @remarks
   * If the signal was provided with a factory function, the function itself
   * will be returned, without invoking it.
   *
   * This method can be used to create copies of signals.
   *
   * @example
   * ```ts
   * const a = createSignal(2);
   * const b = createSignal(() => a);
   * // b() == 2
   *
   * const bClone = createSignal(b.raw());
   * // bClone() == 2
   *
   * a(4);
   * // b() == 4
   * // bClone() == 4
   * ```
   */
  public raw() {
    return this.current;
  }
}
