import {useDuration, usePlayback, useThread} from '../utils';
import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import {LoopCallback} from './loop';

decorate(loopUntil, threadable());
/**
 * Run the given generator until an event occurs.
 *
 * @example
 * ```ts
 * yield* loopUntil(
 *   'Stop Looping',
 *   () => circle().position.x(-10, 0.1).to(10, 0.1)
 * );
 * ```
 *
 * @param event - The event.
 * @param tasks - A list of tasks to run.
 */
export function* loopUntil(
  event: string,
  factory: LoopCallback,
): ThreadGenerator {
  const thread = useThread();
  const step = usePlayback().framesToSeconds(1);
  const targetTime = thread.time() + useDuration(event);

  let iteration = 0;
  while (targetTime - step > thread.fixed) {
    const generator = factory(iteration);
    if (generator) {
      yield* generator;
    } else {
      yield;
    }
    iteration += 1;
  }
  thread.time(targetTime);
}
