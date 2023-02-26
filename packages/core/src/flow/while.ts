import {useScene} from '../utils';
import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import {LoopCallback} from './loop';

decorate(loopUntil, threadable());
/**
 * Run the given generator until an event occurs.
 *
 * @example
 * ```ts
 * yield* loopUntil(
 *   'vibrate', 
 *   () => circle().position.x(-10, 0.1).to(10, 0.1)
 * );
 * ```
 *
 * @param event - The event.
 * @param tasks - A list of tasks to run.
 */
export function* loopUntil(
  event: string,
  factory: LoopCallback,
): ThreadGenerator {
  const scene = useScene();
  const frames = scene.timeEvents.register(event);
  let iteration = 0;
  while (scene.project.frame < frames) {
    const generator = factory(iteration);
    if (generator) {
      yield* generator;
    } else {
      yield;
    }
    iteration += 1;
  }
}
