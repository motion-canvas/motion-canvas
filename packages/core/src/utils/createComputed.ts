import {FlagDispatcher, Subscribable} from '../events';
import {
  collect,
  DependencyContext,
  finishCollecting,
  startCollecting,
} from './createSignal';

export type Computed<TValue> = (...args: any[]) => TValue;

export function createComputed<TValue>(
  factory: Computed<TValue>,
): Computed<TValue> {
  let last: TValue;
  const event = new FlagDispatcher();
  const context: DependencyContext = {
    dependencies: new Set<Subscribable<void>>(),
    handler: () => event.raise(),
  };

  const handler = <Computed<TValue>>function handler(...args: any[]) {
    if (event.isRaised()) {
      context.dependencies.forEach(dep => dep.unsubscribe(context.handler));
      context.dependencies.clear();
      context.stack = new Error().stack;
      startCollecting(context);
      last = factory(...args);
      finishCollecting(context);
    }
    event.reset();
    collect(event.subscribable);
    return last;
  };

  context.handler();

  return handler;
}
