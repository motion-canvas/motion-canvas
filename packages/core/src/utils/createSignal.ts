import {EventHandler, FlagDispatcher, Subscribable} from '../events';
import {
  deepLerp,
  easeInOutCubic,
  TimingFunction,
  tween,
  InterpolationFunction,
} from '../tweening';
import {ThreadGenerator} from '../threading';

type DependencyContext = [Set<Subscribable<void>>, EventHandler<void>];

export type SignalValue<TValue> = TValue | (() => TValue);

export interface SignalSetter<TValue, TReturn = void> {
  (value: SignalValue<TValue>): TReturn;
}

export interface SignalGetter<TValue> {
  (): TValue;
}

export interface SignalTween<TValue> {
  (
    value: SignalValue<TValue>,
    time: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<TValue>,
  ): ThreadGenerator;
}

export interface SignalUtils<TReturn> {
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
  reset(): TReturn;

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
  save(): TReturn;
}

export interface Signal<TValue, TReturn = void>
  extends SignalSetter<TValue, TReturn>,
    SignalGetter<TValue>,
    SignalTween<TValue>,
    SignalUtils<TReturn> {}

const collectionStack: DependencyContext[] = [];

export function startCollecting(context: DependencyContext) {
  collectionStack.push(context);
}

export function finishCollecting(context: DependencyContext) {
  if (collectionStack.pop()[0] !== context[0]) {
    throw new Error('collectStart/collectEnd was called out of order');
  }
}

export function collect(subscribable: Subscribable<void>) {
  if (collectionStack.length > 0) {
    const [set, handler] = collectionStack.at(-1);
    set.add(subscribable);
    subscribable.subscribe(handler);
  }
}

export function isReactive<T>(value: SignalValue<T>): value is () => T {
  return typeof value === 'function';
}

export function createSignal<TValue, TReturn = void>(
  initial?: SignalValue<TValue>,
  defaultInterpolation: InterpolationFunction<TValue> = deepLerp,
  setterReturn?: TReturn,
): Signal<TValue, TReturn> {
  let current: SignalValue<TValue>;
  let last: TValue;
  const dependencies = new Set<Subscribable<void>>();
  const event = new FlagDispatcher();

  function set(value: SignalValue<TValue>) {
    if (current === value) {
      return setterReturn;
    }

    current = value;
    markDirty();

    if (dependencies.size > 0) {
      dependencies.forEach(dep => dep.unsubscribe(markDirty));
      dependencies.clear();
    }

    if (!isReactive(value)) {
      last = value;
    }

    return setterReturn;
  }

  function get(): TValue {
    if (event.isRaised() && isReactive(current)) {
      dependencies.forEach(dep => dep.unsubscribe(markDirty));
      dependencies.clear();
      startCollecting([dependencies, markDirty]);
      last = current();
      finishCollecting([dependencies, markDirty]);
    }
    event.reset();
    collect(event.subscribable);
    return last;
  }

  function markDirty() {
    event.raise();
  }

  const handler = <Signal<TValue, TReturn>>(
    function handler(
      value?: SignalValue<TValue>,
      duration?: number,
      timingFunction: TimingFunction = easeInOutCubic,
      interpolationFunction: InterpolationFunction<TValue> = defaultInterpolation,
    ) {
      if (value === undefined) {
        return get();
      }

      if (duration === undefined) {
        return set(value);
      }

      const from = get();
      return tween(
        duration,
        v => {
          set(
            interpolationFunction(
              from,
              isReactive(value) ? value() : value,
              timingFunction(v),
            ),
          );
        },
        () => set(value),
      );
    }
  );

  Object.defineProperty(handler, 'reset', {
    value: initial !== undefined ? () => set(initial) : () => setterReturn,
  });

  Object.defineProperty(handler, 'save', {
    value: () => set(get()),
  });

  if (initial !== undefined) {
    set(initial);
  }

  return handler;
}
