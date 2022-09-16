import {FlagDispatcher, Subscribable} from '../events';
import {
  collect,
  finishCollecting,
  SignalGetter,
  startCollecting,
} from './createSignal';

export type Computed<TValue> = SignalGetter<TValue>;

export function createComputed<TValue>(
  factory: SignalGetter<TValue>,
): Computed<TValue> {
  let last: TValue;
  const dependencies = new Set<Subscribable<void>>();
  const event = new FlagDispatcher();

  function markDirty() {
    event.raise();
  }

  const handler = <Computed<TValue>>function handler() {
    if (event.isRaised()) {
      dependencies.forEach(dep => dep.unsubscribe(markDirty));
      dependencies.clear();
      startCollecting([dependencies, markDirty]);
      last = factory();
      finishCollecting([dependencies, markDirty]);
    }
    event.reset();
    collect(event.subscribable);
    return last;
  };

  markDirty();

  return handler;
}
