import {waitFor} from './scheduling';
import {decorate, threadable} from '../decorators';
import {isThreadGenerator, ThreadGenerator} from '../threading';

decorate(delay, threadable());
/**
 * Run the given generator or callback after a specific amount of time.
 *
 * Example:
 * ```ts
 * yield* delay(1, rect.fill('#ff0000', 2));
 * ```
 *
 * Note that the same animation can be written as:
 * ```ts
 * yield* waitFor(1),
 * yield* rect.fill('#ff0000', 2),
 * ```
 *
 * The reason `delay` exists is to make it easier to pass it to other flow
 * functions. For example:
 * ```ts
 * yield* all(
 *   rect.opacity(1, 3),
 *   delay(1, rect.fill('#ff0000', 2));
 * );
 * ```
 *
 * @param time Delay in seconds
 * @param task
 */
export function* delay(
  time: number,
  task: ThreadGenerator | Callback,
): ThreadGenerator {
  yield* waitFor(time);
  if (isThreadGenerator(task)) {
    yield* task;
  } else {
    task();
  }
}
