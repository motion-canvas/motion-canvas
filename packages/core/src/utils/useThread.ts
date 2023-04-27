import type {Thread} from '../threading';
import {DetailedError} from './DetailedError';

const ThreadStack: Thread[] = [];

/**
 * Get a reference to the current thread.
 */
export function useThread(): Thread {
  const thread = ThreadStack.at(-1);
  if (!thread) {
    throw new DetailedError(
      'The thread is not available in the current context.',
      // language=markdown
      `\`useThread()\` can only be called from within generator functions.
      It's not available during rendering.`,
    );
  }
  return thread;
}

export function startThread(thread: Thread) {
  ThreadStack.push(thread);
}

export function endThread(thread: Thread) {
  if (ThreadStack.pop() !== thread) {
    throw new Error('startThread/endThread was called out of order.');
  }
}
