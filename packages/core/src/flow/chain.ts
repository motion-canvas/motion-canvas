import {decorate, threadable} from '../decorators';
import {ThreadGenerator, isThreadGenerator} from '../threading';

decorate(chain, threadable());
/**
 * Run tasks one after another.
 *
 * @example
 * ```ts
 * // current time: 0s
 * yield* chain(
 *   rect.fill('#ff0000', 2),
 *   rect.opacity(1, 1),
 * );
 * // current time: 3s
 * ```
 *
 * Note that the same animation can be written as:
 * ```ts
 * yield* rect.fill('#ff0000', 2),
 * yield* rect.opacity(1, 1),
 * ```
 *
 * The reason `chain` exists is to make it easier to pass it to other flow
 * functions. For example:
 * ```ts
 * yield* all(
 *   rect.radius(20, 3),
 *   chain(
 *     rect.fill('#ff0000', 2),
 *     rect.opacity(1, 1),
 *   ),
 * );
 * ```
 *
 * @param tasks - A list of tasks to run.
 */
export function* chain(
  ...tasks: (ThreadGenerator | Callback)[]
): ThreadGenerator {
  for (const generator of tasks) {
    if (isThreadGenerator(generator)) {
      yield* generator;
    } else {
      generator();
    }
  }
}
