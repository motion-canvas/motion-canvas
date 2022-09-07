import {FlagDispatcher, Subscribable} from '../events';
import {
  deepLerp,
  easeInOutCubic,
  TimingFunction,
  tween,
  InterpolationFunction,
} from '../tweening';
import {ThreadGenerator} from '../threading';

// TODO Consider switching to a Set
type Dependencies = Subscribable<any>[];

export type SignalValue<TValue> = TValue | (() => TValue);

export interface Signal<TValue, TReturn = void> {
  (): TValue;
  (value: SignalValue<TValue>): TReturn;
  (
    value: TValue,
    time: number,
    timingFunction?: TimingFunction,
    interpolationFunction?: InterpolationFunction<TValue>,
  ): ThreadGenerator;
  get onChanged(): Subscribable<void>;
}

const collectionStack: Dependencies[] = [];

export function startCollecting(deps: Dependencies) {
  collectionStack.push(deps);
}

export function finishCollecting(deps: Dependencies) {
  if (collectionStack.pop() !== deps) {
    throw new Error('collectStart/collectEnd was called out of order');
  }
}

export function collect(subscribable: Subscribable<any>) {
  collectionStack.at(-1)?.push(subscribable);
}

export function isReactive<T>(value: SignalValue<T>): value is () => T {
  return typeof value === 'function';
}

export function useSignal<TValue, TReturn = void>(
  initial?: SignalValue<TValue>,
  defaultInterpolation?: InterpolationFunction<TValue>,
  setterReturn?: TReturn,
): Signal<TValue, TReturn> {
  let current: SignalValue<TValue>;
  let last: TValue;
  let currentDeps: Dependencies = [];
  let updateDeps = false;
  const event = new FlagDispatcher();

  function set(value: SignalValue<TValue>) {
    if (current === value) {
      return;
    }

    current = value;
    markDirty();

    if (isReactive(value)) {
      updateDeps = true;
    } else {
      currentDeps.forEach(dep => dep.unsubscribe(markDirty));
      currentDeps = [];
      updateDeps = false;
      last = value;
    }
  }

  function get(): TValue {
    if (event.isRaised() && isReactive(current)) {
      const deps: Dependencies = [];
      startCollecting(deps);
      last = current();
      finishCollecting(deps);

      // TODO Consider removing this check to always update dependencies.
      if (updateDeps) {
        currentDeps.forEach(dep => dep.unsubscribe(markDirty));
        currentDeps = deps;
        currentDeps.forEach(dep => dep.subscribe(markDirty));
        updateDeps = false;
      }
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
      value?: TValue | (() => TValue),
      duration?: number,
      timingFunction: TimingFunction = easeInOutCubic,
      customInterpolation?: InterpolationFunction<TValue>,
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
      const lerp =
        customInterpolation ?? defaultInterpolation ?? deepLerp<TValue>;
      return tween(duration, v => {
        set(lerp(from, isReactive(value) ? value() : value, timingFunction(v)));
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
