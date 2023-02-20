import { debug, useProject, useScene } from '../utils';
import {decorate, threadable} from '../decorators';
import {cancel, join, ThreadGenerator} from '../threading';
import { all } from './all';
import { loop, LoopCallback } from './loop';

decorate(loopUntil, threadable());
/**
 * Run the given generator until an event occurs.
 * 
 * @example
 * ```tsx
 * const circle = createRef<Circle>();
 *
 * view.add(
 * <Circle ref={circle} width={320} height={320} fill={'lightseagreen'} />,
 * );
 *
 * yield* loopUntil(
 *  'vibrate', () =>
 *  circle().position.x(-10,0.1).to(10,0.1),
 * );```
 *
 * @param event - The event.
 * @param tasks - A list of tasks to run.
 *                
 */
export function* loopUntil(
  event: string,
  factory: LoopCallback
): ThreadGenerator {
  const scene = useScene();
  const frames = scene.timeEvents.register(event);
  var iterator = 0;
  while (scene.project.frame < frames) {
    const generator = factory(iterator);
    if (generator) {
      yield* generator;
    } else {
      yield;
    }
    iterator += 1;
  }
}
