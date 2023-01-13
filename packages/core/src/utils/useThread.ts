import type {Thread} from '../threading';
import {DetailedError} from '../utils';

const threadStack: Thread[] = [];

/**
 * Get a reference to the current thread.
 */
export function useThread(): Thread {
  const thread = threadStack.at(-1);
  if (!thread) {
    throw new DetailedError(
      'The thread is not available in the current context.',
      `<code>useThread()</code> can only be called from within generator functions.
      It's not available during rendering.`,
    );
  }
  return thread;
}

export function startThread(thread: Thread) {
  threadStack.push(thread);
}

export function endThread(thread: Thread) {
  if (threadStack.pop() !== thread) {
    throw new Error('startThread/endThread was called out of order.');
  }
}
