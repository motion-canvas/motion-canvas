import {setTaskName, ThreadGenerator} from '../threading';
/**
 * Turn the given generator function into a task.
 *
 * @remarks
 * If you want to immediately run the generator in its own thread, you can use
 * {@link threading.spawn} instead. This function is useful when you want to
 * pass the created task to other flow functions.
 *
 * @example
 * ```ts
 * yield* all(
 *   run(function* () {
 *     // do things
 *   }),
 *   rect.opacity(1, 1),
 * );
 * ```
 *
 * @param runner - A generator function or a factory that creates the generator.
 */

export function run(runner: () => ThreadGenerator): ThreadGenerator;
/**
 * Turn the given generator function into a task.
 *
 * @remarks
 * If you want to immediately run the generator in its own thread, you can use
 * {@link threading.spawn} instead. This function is useful when you want to
 * pass the created task to other flow functions.
 *
 * @example
 * ```ts
 * yield* all(
 *   run(function* () {
 *     // do things
 *   }),
 *   rect.opacity(1, 1),
 * );
 * ```
 *
 * @param runner - A generator function or a factory that creates the generator.
 * @param name - An optional name used when displaying this generator in the UI.
 */
export function run(
  name: string,
  runner: () => ThreadGenerator,
): ThreadGenerator;
export function run(
  firstArg: (() => ThreadGenerator) | string,
  runner?: () => ThreadGenerator,
): ThreadGenerator {
  let task;
  if (typeof firstArg === 'string') {
    task = runner!();
    setTaskName(task, firstArg);
  } else {
    task = firstArg();
    setTaskName(task, task);
  }

  return task;
}
