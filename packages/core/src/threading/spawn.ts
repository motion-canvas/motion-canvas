import {useThread} from '../utils';
import {ThreadGenerator} from './ThreadGenerator';

/**
 * Run the given task concurrently.
 *
 * @example
 * Using an existing task:
 * ```ts
 * spawn(rect().opacity(1, 1));
 * ```
 * Using a generator function:
 * ```ts
 * spawn(function* () {
 *   yield* rect().opacity(1, 1);
 *   yield* waitFor('click');
 *   yield* rect().opacity(0, 1);
 * });
 * ```
 * Await the spawned task:
 * ```ts
 * const task = spawn(rect().opacity(1, 1));
 * // do some other things
 * yield* join(task); // await the task
 * ```
 *
 * @param task - Either a generator function or a task to run.
 */
export function spawn(
  task: ThreadGenerator | (() => ThreadGenerator),
): ThreadGenerator {
  return useThread().root.spawn(task);
}
