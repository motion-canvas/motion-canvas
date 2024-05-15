import {run, waitFor} from '../flow';
import {ThreadGenerator} from '../threading';
import {
  InterpolationFunction,
  TimingFunction,
  easeInOutCubic,
  tween,
} from '../tweening';
import {errorToLog, useLogger} from '../utils';
import {DependencyContext} from './DependencyContext';
import {DEFAULT} from './symbols';
import {
  SignalExtensions,
  SignalGenerator,
  SignalGetter,
  SignalSetter,
  SignalTween,
  SignalValue,
} from './types';
import {isReactive, unwrap} from './utils';

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
    SignalTween<TSetterValue, TValue> {
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
  protected extensions: SignalExtensions<TSetterValue, TValue>;
  protected current: SignalValue<TSetterValue> | undefined;
  protected last: TValue | undefined;
  protected tweening = false;

  public constructor(
    private initial: SignalValue<TSetterValue> | undefined,
    private readonly interpolation: InterpolationFunction<TValue>,
    owner: TOwner = <TOwner>(<unknown>undefined),
    protected parser: (value: TSetterValue) => TValue = value => <TValue>value,
    extensions: Partial<SignalExtensions<TSetterValue, TValue>> = {},
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

    this.extensions = {
      getter: this.getter.bind(this),
      setter: this.setter.bind(this),
      tweener: this.tweener.bind(this),
      ...extensions,
    };
  }

  public toSignal(): Signal<TSetterValue, TValue, TOwner> {
    return this.invokable;
  }

  public parse(value: TSetterValue): TValue {
    return this.parser(value);
  }

  public set(value: SignalValue<TSetterValue> | typeof DEFAULT): TOwner {
    this.extensions.setter(value);
    return this.owner;
  }

  public setter(value: SignalValue<TSetterValue> | typeof DEFAULT): TOwner {
    if (value === DEFAULT) {
      value = this.initial!;
    }

    if (this.current === value) {
      return this.owner;
    }

    this.current = value;
    this.clearDependencies();

    if (!isReactive(value)) {
      this.last = this.parse(value);
    }

    this.markDirty();
    return this.owner;
  }

  public get(): TValue {
    return this.extensions.getter();
  }

  public getter(): TValue {
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

    const queue = this.createQueue(timingFunction, interpolationFunction);
    return queue.to(value, duration);
  }

  protected createQueue(
    defaultTimingFunction: TimingFunction,
    defaultInterpolationFunction: InterpolationFunction<TValue>,
  ) {
    const initial = this.get();
    const queue: ThreadGenerator[] = [];

    const task = run('animation chain', function* animate() {
      while (queue.length > 0) {
        yield* queue.shift()!;
      }
    }) as SignalGenerator<TSetterValue, TValue>;

    task.to = (
      value: SignalValue<TSetterValue> | typeof DEFAULT,
      duration: number,
      timingFunction = defaultTimingFunction,
      interpolationFunction = defaultInterpolationFunction,
    ) => {
      defaultTimingFunction = timingFunction;
      defaultInterpolationFunction = interpolationFunction;
      queue.push(
        this.tween(value, duration, timingFunction, interpolationFunction),
      );
      return task;
    };

    task.back = (
      time: number,
      timingFunction = defaultTimingFunction,
      interpolationFunction = defaultInterpolationFunction,
    ) => {
      defaultTimingFunction = timingFunction;
      defaultInterpolationFunction = interpolationFunction;
      queue.push(
        this.tween(
          initial,
          time,
          defaultTimingFunction,
          defaultInterpolationFunction,
        ),
      );
      return task;
    };

    task.wait = (duration: number) => {
      queue.push(waitFor(duration));
      return task;
    };

    task.run = (generator: ThreadGenerator) => {
      queue.push(generator);
      return task;
    };

    task.do = (callback: () => void) => {
      queue.push(
        run(function* () {
          callback();
        }),
      );
      return task;
    };

    return task;
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

    this.tweening = true;
    yield* this.extensions.tweener(
      value,
      duration,
      timingFunction,
      interpolationFunction,
    );
    this.set(value);
    this.tweening = false;
  }

  public *tweener(
    value: SignalValue<TSetterValue>,
    duration: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<TValue>,
  ): ThreadGenerator {
    const from = this.get();
    yield* tween(duration, v => {
      this.set(
        interpolationFunction(
          from,
          this.parse(unwrap(value)),
          timingFunction(v),
        ),
      );
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
   * Get the initial value of this signal.
   */
  public getInitial() {
    return this.initial;
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

  /**
   * Is the signal undergoing a tween?
   */
  public isTweening() {
    return this.tweening;
  }
}
