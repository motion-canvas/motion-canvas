import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from './ThreadGenerator';

/**
 * @internal
 */
export const THREAD_CANCEL = Symbol.for('THREAD_CANCEL');

/**
 * An instruction passed to the {@link threads} generator to cancel tasks.
 */
export interface CancelYieldResult {
  /**
   * Tasks to cancel.
   */
  [THREAD_CANCEL]: ThreadGenerator[];
}

/**
 * Check if the given value is a {@link CancelYieldResult}.
 *
 * @param value A possible {@link CancelYieldResult}.
 */
export function isCancelYieldResult(
  value: unknown,
): value is CancelYieldResult {
  return typeof value === 'object' && THREAD_CANCEL in value;
}

decorate(cancel, threadable());
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
 * @param tasks
 */
export function* cancel(...tasks: ThreadGenerator[]): ThreadGenerator {
  yield {[THREAD_CANCEL]: tasks};
}
