import {setTaskName, ThreadGenerator} from '../threading';

/**
 * Turn the given generator function into a threadable generator.
 *
 * @example
 * ```ts
 * yield run(function* () {
 *   // do things
 * });
 * ```
 *
 * @param runner - A generator function or a factory that creates the generator.
 */
export function run(runner: () => ThreadGenerator): ThreadGenerator;
/**
 * Turn the given generator function into a threadable generator.
 *
 * @example
 * ```ts
 * yield run(function* () {
 *   // do things
 * });
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
