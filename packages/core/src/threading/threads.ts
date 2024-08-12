import {decorate, threadable} from '../decorators';
import {usePlayback} from '../utils';
import {Thread} from './Thread';
import {ThreadGenerator, isThreadGenerator} from './ThreadGenerator';
import {setTaskName} from './names';

/**
 * Check if the given value is a [Promise][promise].
 *
 * @param value - A possible [Promise][promise].
 *
 * [promise]: https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/promise
 */
export function isPromise(value: any): value is Promise<any> {
  return typeof value?.then === 'function';
}

/**
 * A generator function or a normal function that returns a generator.
 */
export interface ThreadsFactory {
  (): ThreadGenerator;
}

export interface ThreadsCallback {
  (root: Thread): void;
}

decorate(threads, threadable());
/**
 * Create a context in which generators can be run concurrently.
 *
 * @remarks
 * From the perspective of the external generator, `threads` is executed
 * synchronously. By default, each scene generator is wrapped in its own
 * `threads` generator.
 *
 * @example
 * ```ts
 * // first
 *
 * yield* threads(function* () {
 *   const task = yield generatorFunction();
 *   // second
 * }); // <- `task` will be terminated here because the scope
 *     //    of this `threads` generator has ended
 *
 * // third
 * ```
 *
 * @param factory - A function that returns the generator to run.
 * @param callback - Called whenever threads are created, canceled or finished.
 *                   Used for debugging purposes.
 */
export function* threads(
  factory: ThreadsFactory,
  callback?: ThreadsCallback,
): ThreadGenerator {
  const playback = usePlayback();
  const root = factory();
  setTaskName(root, 'root');
  const rootThread = new Thread(root);
  callback?.(rootThread);

  let threads: Thread[] = [rootThread];
  while (threads.length > 0) {
    const newThreads = [];
    const queue = [...threads];
    const dt = playback.deltaTime;

    while (queue.length > 0) {
      const thread = queue.pop();
      if (!thread || thread.canceled) {
        continue;
      }

      const result = thread.next();
      if (result.done) {
        thread.cancel();
        continue;
      }

      if (isThreadGenerator(result.value)) {
        const child = new Thread(result.value);
        thread.value = result.value;
        thread.add(child);

        queue.push(thread);
        queue.push(child);
      } else if (result.value) {
        thread.value = yield result.value;
        queue.push(thread);
      } else {
        thread.update(dt);
        thread.drain(task => {
          const child = new Thread(task);
          thread.add(child);
          newThreads.unshift(child);
        });

        newThreads.unshift(thread);
      }
    }

    threads = [];
    for (const thread of newThreads) {
      if (!thread.canceled) {
        threads.push(thread);
        thread.runDeferred();
      }
    }

    if (threads.length > 0) yield;
  }
}
