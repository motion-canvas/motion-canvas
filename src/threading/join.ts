import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from './ThreadGenerator';

/**
 * @internal
 */
export const THREAD_JOIN = Symbol.for('THREAD_JOIN');

/**
 * An instruction passed to the {@link threads} generator to join tasks.
 */
export interface JoinYieldResult {
  /**
   * Tasks to join.
   */
  [THREAD_JOIN]: ThreadGenerator[];
  /**
   * Whether we should wait for all tasks or for at least one.
   */
  all: boolean;
}

/**
 * Check if the given value is a {@link JoinYieldResult}.
 *
 * @param value A possible {@link JoinYieldResult}.
 */
export function isJoinYieldResult(value: unknown): value is JoinYieldResult {
  return typeof value === 'object' && THREAD_JOIN in value;
}

decorate(join, threadable());
/**
 * Pause the current generator until all listed tasks are finished.
 *
 * Example:
 * ```ts
 * const task = yield generatorFunction();
 *
 * // do something concurrently
 *
 * yield* join(task);
 * ```
 *
 * @param tasks
 */
export function join(...tasks: ThreadGenerator[]): ThreadGenerator;
/**
 * Pause the current generator until listed tasks are finished.
 *
 * Example
 * ```ts
 * const taskA = yield generatorFunctionA();
 * const taskB = yield generatorFunctionB();
 *
 * // do something concurrently
 *
 * // await any of the tasks
 * yield* join(false, taskA, taskB);
 * ```
 *
 * @param all Whether we should wait for all tasks or for at least one.
 * @param tasks
 */
export function join(
  all: boolean,
  ...tasks: ThreadGenerator[]
): ThreadGenerator;
export function* join(
  first: ThreadGenerator | boolean,
  ...tasks: ThreadGenerator[]
): ThreadGenerator {
  let all = true;
  if (typeof first === 'boolean') {
    all = first;
  } else {
    tasks.push(first);
  }

  yield* yield {[THREAD_JOIN]: tasks, all};
}
