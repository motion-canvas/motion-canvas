import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import {useDuration} from '../utils';
import {LoopCallback} from './loop';
import {loopFor} from './loopFor';

decorate(loopUntil, threadable());
/**
 * Run a generator in a loop until the given time event.
 *
 * @remarks
 * Generators are executed completely before the next iteration starts.
 * An iteration is allowed to finish even when the time is up. This means that
 * the actual duration of the loop may be longer than the given duration.
 *
 * @example
 * ```ts
 * yield* loopUntil(
 *   'Stop Looping',
 *   () => circle().position.x(-10, 0.1).to(10, 0.1)
 * );
 * ```
 *
 * @param event - The event.
 * @param factory - A function creating the generator to run. Because generators
 *                  can't be reset, a new generator is created on each
 *                  iteration.
 */
export function* loopUntil(
  event: string,
  factory: LoopCallback,
): ThreadGenerator {
  yield* loopFor(useDuration(event), factory);
}
