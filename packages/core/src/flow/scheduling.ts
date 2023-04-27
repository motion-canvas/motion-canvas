import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import {useDuration, usePlayback, useThread} from '../utils';

decorate(waitUntil, threadable());
/**
 * Wait until the given time event.
 *
 * @remarks
 * Time events are displayed on the timeline and can be edited to adjust the
 * delay. By default, an event happens immediately - without any delay.
 *
 * @example
 * ```ts
 * yield waitUntil('event');
 * ```
 *
 * @param event - The name of the time event.
 * @param after - An optional task to be run after the function completes.
 */
export function* waitUntil(
  event: string,
  after?: ThreadGenerator,
): ThreadGenerator {
  yield* waitFor(useDuration(event));

  if (after) {
    yield* after;
  }
}

decorate(waitFor, threadable());
/**
 * Wait for the given amount of time.
 *
 * @example
 * ```ts
 * // current time: 0s
 * yield waitFor(2);
 * // current time: 2s
 * yield waitFor(3);
 * // current time: 5s
 * ```
 *
 * @param seconds - The relative time in seconds.
 * @param after - An optional task to be run after the function completes.
 */
export function* waitFor(
  seconds = 0,
  after?: ThreadGenerator,
): ThreadGenerator {
  const thread = useThread();
  const step = usePlayback().framesToSeconds(1);

  const targetTime = thread.time() + seconds;
  // subtracting the step is not necessary, but it keeps the thread time ahead
  // of the project time.
  while (targetTime - step > thread.fixed) {
    yield;
  }
  thread.time(targetTime);

  if (after) {
    yield* after;
  }
}
