import {useThread} from '../utils';
import {ThreadGenerator} from './ThreadGenerator';

/**
 * Cancel all listed tasks.
 *
 * Example:
 * ```ts
 * const task = yield generatorFunction();
 *
 * // do something concurrently
 *
 * yield* cancel(task);
 * ```
 *
 * @param tasks - A list of tasks to cancel.
 */
export function cancel(...tasks: ThreadGenerator[]) {
  const thread = useThread();
  for (const task of tasks) {
    const child = thread.children.find(thread => thread.runner === task);
    if (child && !child.canceled) {
      child.cancel();
      child.time(thread.time());
    }
  }
}
