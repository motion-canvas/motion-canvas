import {decorate, threadable} from '../decorators';
import {ThreadGenerator, join} from '../threading';

decorate(all, threadable());
/**
 * Run all tasks concurrently and wait for all of them to finish.
 *
 * @example
 * ```ts
 * // current time: 0s
 * yield* all(
 *   rect.fill('#ff0000', 2),
 *   rect.opacity(1, 1),
 * );
 * // current time: 2s
 * ```
 *
 * @param tasks - A list of tasks to run.
 */
export function* all(...tasks: ThreadGenerator[]): ThreadGenerator {
  for (const task of tasks) {
    yield task;
  }
  yield* join(...tasks);
}
