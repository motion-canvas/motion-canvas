import {ThreadGeneratorFactory, threads} from '@motion-canvas/core';
import {useScene2D} from '../../scenes';
import {View2D} from '../View2D';

/**
 * Turn a generator factory into a test function.
 *
 * @example
 * ```ts
 * it(
 *   'Example test',
 *   generatorTest(function* () {
 *     yield* waitFor(1);
 *     expect(useTime()).toBe(1);
 *   }),
 * );
 * ```
 *
 * @param factory - The generator factory to test.
 */
export function generatorTest(factory: ThreadGeneratorFactory<View2D>) {
  return () => {
    const view = useScene2D().getView();
    const tasks = threads(() => factory(view));
    [...tasks];
  };
}
