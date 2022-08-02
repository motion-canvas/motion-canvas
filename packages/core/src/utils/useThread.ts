import type {Thread} from '../threading';

const threadStack: Thread[] = [];

/**
 * Get a reference to the current thread.
 */
export function useThread(): Thread {
  return threadStack.at(-1);
}

export function startThread(thread: Thread) {
  threadStack.push(thread);
}

export function endThread(thread: Thread) {
  if (threadStack.pop() !== thread) {
    throw new Error('startThread/endThread was called out of order');
  }
}
