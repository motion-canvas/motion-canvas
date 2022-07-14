import {waitFor} from './scheduling';
import {decorate, threadable} from '../decorators';
import {join, ThreadGenerator} from '../threading';

decorate(sequence, threadable());
/**
 * Start all tasks one after another with a constant delay between.
 *
 * The function doesn't wait until the previous task in the sequence has
 * finished. Once the delay has passed, the next task will start event if
 * the previous is still running.
 *
 * @example
 * ```ts
 * yield* sequence(
 *   0.1,
 *   ...rects.map(rect => rect.x(100, 1))
 * );
 * ```
 *
 * @param delay
 * @param tasks
 */
export function* sequence(
  delay: number,
  ...tasks: ThreadGenerator[]
): ThreadGenerator {
  for (const task of tasks) {
    yield task;
    yield* waitFor(delay);
  }

  yield* join(...tasks);
}
