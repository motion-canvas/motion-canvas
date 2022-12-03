import {FlagDispatcher, Subscribable} from '../events';
import {
  collect,
  DependencyContext,
  finishCollecting,
  startCollecting,
} from './createSignal';
import {useLogger} from './useProject';

export type Computed<TValue> = (...args: any[]) => TValue;

export function createComputed<TValue>(
  factory: Computed<TValue>,
  owner?: any,
): Computed<TValue> {
  let last: TValue;
  const event = new FlagDispatcher();
  const context: DependencyContext = {
    dependencies: new Set<Subscribable<void>>(),
    handler: () => event.raise(),
    owner,
  };

  const handler = <Computed<TValue>>function handler(...args: any[]) {
    if (event.isRaised()) {
      context.dependencies.forEach(dep => dep.unsubscribe(context.handler));
      context.dependencies.clear();
      context.stack = new Error().stack;
      startCollecting(context);
      try {
        last = factory(...args);
      } catch (e) {
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
  };

  context.handler();

  return handler;
}
