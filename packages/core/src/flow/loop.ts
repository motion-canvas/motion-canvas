import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';

/**
 * A callback called by {@link loop} during each iteration.
 */
export interface LoopCallback {
  /**
   * @param i The current iteration index.
   */
  (i: number): ThreadGenerator | void;
}

decorate(loop, threadable());
/**
 * Run the given generator N times.
 *
 * Each time iteration waits until the previous one is completed.
 *
 * Example:
 * ```ts
 * const colors = [
 *   '#ff6470',
 *   '#ffc66d',
 *   '#68abdf',
 *   '#99c47a',
 * ];
 *
 * yield* loop(
 *   colors.length,
 *   i => rect.fill(colors[i], 2),
 * });
 * ```
 *
 * @param iterations Number of iterations.
 * @param factory A function creating the generator to run. Because generators
 *                can't be reset, a new generator is created each iteration.
 */
export function* loop(
  iterations: number,
  factory: LoopCallback,
): ThreadGenerator {
  for (let i = 0; i < iterations; i++) {
    const generator = factory(i);
    if (generator) {
      yield* generator;
    } else {
      yield;
    }
  }
}
