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

export interface Signal<TValue, TReturn = void> {
  (): TValue;
  (value: SignalValue<TValue>): TReturn;
  (
    value: SignalValue<TValue>,
    time: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<TValue>,
  ): ThreadGenerator;
  get onChanged(): Subscribable<void>;
}

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

export function useSignal<TValue, TReturn = void>(
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
      return;
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
  }

  function get(): TValue {
    if (event.isRaised() && isReactive(current)) {
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
      // Getter
      if (value === undefined) {
        return get();
      }

      // Setter
      if (duration === undefined) {
        set(value);
        return setterReturn;
      }

      // Tween
      const from = get();
      return tween(duration, v => {
        set(
          interpolationFunction(
            from,
            isReactive(value) ? value() : value,
            timingFunction(v),
          ),
        );
      });
    }
  );

  Object.defineProperty(handler, 'onChanged', {
    value: event.subscribable,
  });

  if (initial !== undefined) {
    handler(initial);
  }

  return handler;
}
