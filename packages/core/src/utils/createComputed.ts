import {FlagDispatcher, Subscribable} from '../events';
import {collect, finishCollecting, startCollecting} from './createSignal';

export type Computed<TValue> = (...args: any[]) => TValue;

export function createComputed<TValue>(
  factory: Computed<TValue>,
): Computed<TValue> {
  let last: TValue;
  const dependencies = new Set<Subscribable<void>>();
  const event = new FlagDispatcher();

  function markDirty() {
    event.raise();
  }

  const handler = <Computed<TValue>>function handler(...args: any[]) {
    if (event.isRaised()) {
      dependencies.forEach(dep => dep.unsubscribe(markDirty));
      dependencies.clear();
      startCollecting([dependencies, markDirty]);
      last = factory(...args);
      finishCollecting([dependencies, markDirty]);
    }
    event.reset();
    collect(event.subscribable);
    return last;
  };

  markDirty();

  return handler;
}
