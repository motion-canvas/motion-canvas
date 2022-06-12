import {join, ThreadGenerator} from '../threading';
import {decorate, threadable} from '../decorators';

decorate(any, threadable());
/**
 * Run all tasks concurrently and wait for any of them to finish.
 *
 * Example:
 * ```
 * // current time: 0s
 * yield* all(
 *   rect.fill('#ff0000', 2),
 *   rect.opacity(1, 1),
 * );
 * // current time: 1s
 * ```
 *
 * @param tasks
 */
export function* any(...tasks: ThreadGenerator[]): ThreadGenerator {
  for (const task of tasks) {
    yield task;
  }
  yield* join(false, ...tasks);
}
