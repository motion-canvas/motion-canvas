import type {Thread} from '../threading';

let currentThread: Thread;

/**
 * Get a reference to the current thread.
 */
export function useThread() {
  return currentThread;
}

export function setThread(thread: Thread) {
  currentThread = thread;
}
