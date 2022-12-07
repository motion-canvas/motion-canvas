import {EventHandler, FlagDispatcher, Subscribable} from '../events';
import {
  deepLerp,
  easeInOutCubic,
  TimingFunction,
  tween,
  InterpolationFunction,
} from '../tweening';
import {ThreadGenerator} from '../threading';
import {useLogger} from './useProject';
import {decorate, threadable} from '../decorators';

export interface DependencyContext {
  dependencies: Set<Subscribable<void>>;
  handler: EventHandler<void>;
  stack?: string;
  owner?: any;
}

export type SignalValue<TValue> = TValue | (() => TValue);

export type SignalGenerator<TValue> = ThreadGenerator & {
  to: SignalTween<TValue>;
};

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
  ): SignalGenerator<TValue>;
}

export interface SignalUtils<TValue, TReturn> {
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
  raw(): SignalValue<TValue>;
}

export interface Signal<TValue, TReturn = void>
  extends SignalSetter<TValue, TReturn>,
    SignalGetter<TValue>,
    SignalTween<TValue>,
    SignalUtils<TValue, TReturn> {}

const collectionStack: DependencyContext[] = [];
let promises: PromiseHandle<any>[] = [];

export function startCollecting(context: DependencyContext) {
  collectionStack.push(context);
}

export function finishCollecting(context: DependencyContext) {
  if (collectionStack.pop() !== context) {
    throw new Error('collectStart/collectEnd was called out of order');
  }
}

export function collect(subscribable: Subscribable<void>) {
  const context = collectionStack.at(-1);
  if (context) {
    context.dependencies.add(subscribable);
    subscribable.subscribe(context.handler);
  }
}

export interface PromiseHandle<T> {
  promise: Promise<T>;
  value: T;
  stack?: string;
  owner?: any;
}

export function collectPromise<T>(promise: Promise<T>): PromiseHandle<T | null>;
export function collectPromise<T>(
  promise: Promise<T>,
  initialValue: T,
): PromiseHandle<T>;
export function collectPromise<T>(
  promise: Promise<T>,
  initialValue: T | null = null,
): PromiseHandle<T | null> {
  const handle: PromiseHandle<T | null> = {
    promise,
    value: initialValue,
    stack: collectionStack[0]?.stack,
  };

  const context = collectionStack.at(-2);
  if (context) {
    handle.owner = context.owner;
  }
  promise.then(value => {
    handle.value = value;
    context?.handler();
  });

  promises.push(handle);
  return handle;
}

export function consumePromises(): PromiseHandle<any>[] {
  const result = promises;
  promises = [];
  return result;
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
  const event = new FlagDispatcher();
  const context: DependencyContext = {
    dependencies: new Set<Subscribable<void>>(),
    handler: () => event.raise(),
    owner: setterReturn,
  };

  function set(value: SignalValue<TValue>) {
    if (current === value) {
      return setterReturn;
    }

    current = value;
    markDirty();

    if (context.dependencies.size > 0) {
      context.dependencies.forEach(dep => dep.unsubscribe(markDirty));
      context.dependencies.clear();
    }

    if (!isReactive(value)) {
      last = value;
    }

    return setterReturn;
  }

  function get(): TValue {
    if (event.isRaised() && isReactive(current)) {
      context.dependencies.forEach(dep => dep.unsubscribe(markDirty));
      context.dependencies.clear();
      context.stack = new Error().stack;
      startCollecting(context);
      try {
        last = current();
      } catch (e: any) {
        useLogger().error({
          message: e.message,
          stack: e.stack,
          inspect: context.owner?.key,
        });
      }
      finishCollecting(context);
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

      return makeAnimate(timingFunction, interpolationFunction)(
        value,
        duration,
      );
    }
  );

  function makeAnimate(
    defaultTimingFunction: TimingFunction,
    defaultInterpolationFunction: InterpolationFunction<TValue>,
    before?: ThreadGenerator,
  ) {
    function animate(
      value: SignalValue<TValue>,
      duration: number,
      timingFunction = defaultTimingFunction,
      interpolationFunction = defaultInterpolationFunction,
    ) {
      const task = <SignalGenerator<TValue>>(
        makeTask(value, duration, timingFunction, interpolationFunction, before)
      );
      task.to = makeAnimate(timingFunction, interpolationFunction, task);
      return task;
    }

    return <SignalTween<TValue>>animate;
  }

  decorate(makeTask, threadable());
  function* makeTask(
    value: SignalValue<TValue>,
    duration: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<TValue>,
    before?: ThreadGenerator,
  ) {
    if (before) {
      yield* before;
    }

    const from = get();
    yield* tween(
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

  Object.defineProperty(handler, 'reset', {
    value: initial !== undefined ? () => set(initial) : () => setterReturn,
  });

  Object.defineProperty(handler, 'save', {
    value: () => set(get()),
  });

  Object.defineProperty(handler, 'raw', {
    value: () => current,
  });

  if (initial !== undefined) {
    set(initial);
  }

  return handler;
}
