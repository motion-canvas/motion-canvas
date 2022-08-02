import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import {useProject, useScene, useThread} from '../utils';

decorate(waitUntil, threadable());
/**
 * Wait until the given time event.
 *
 * Time events are displayed on the timeline and can be edited to adjust the
 * delay. By default, an event happens immediately - without any delay.
 *
 * Example:
 * ```ts
 * yield waitUntil('event');
 * ```
 *
 * @param event Name of the time event.
 * @param after
 */
export function* waitUntil(
  event: string,
  after?: ThreadGenerator,
): ThreadGenerator {
  const scene = useScene();
  const frames = scene.timeEvents.register(event);

  while (scene.project.frame < frames) {
    yield;
  }

  if (after) {
    yield* after;
  }
}

decorate(waitFor, threadable());
/**
 * Wait for the given amount of time.
 *
 * Example:
 * ```ts
 * // current time: 0s
 * yield waitFor(2);
 * // current time: 2s
 * yield waitFor(3);
 * // current time: 5s
 * ```
 *
 * @param seconds Relative time in seconds.
 * @param after
 */
export function* waitFor(
  seconds = 0,
  after?: ThreadGenerator,
): ThreadGenerator {
  const project = useProject();
  const thread = useThread();
  const step = project.framesToSeconds(1);

  const targetTime = thread.time + seconds;
  // subtracting the step is not necessary, but it keeps the thread time ahead
  // of the project time.
  while (targetTime - step > project.time) {
    yield;
  }
  thread.time = targetTime;

  if (after) {
    yield* after;
  }
}
