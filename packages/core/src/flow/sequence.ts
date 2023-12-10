import {decorate, threadable} from '../decorators';
import {ThreadGenerator, join} from '../threading';
import {waitFor} from './scheduling';

decorate(sequence, threadable());
/**
 * Start all tasks one after another with a constant delay between.
 *
 * @remarks
 * The function doesn't wait until the previous task in the sequence has
 * finished. Once the delay has passed, the next task will start even if
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
 * @param delay - The delay between each of the tasks.
 * @param tasks - A list of tasks to be run in a sequence.
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
