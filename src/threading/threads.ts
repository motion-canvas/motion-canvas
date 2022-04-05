import {GeneratorHelper} from '../helpers';
import {decorate, threadable} from '../decorators';
import {Thread} from './Thread';
import {THREAD_JOIN} from './join';
import {THREAD_CANCEL} from './cancel';

export interface ThreadsFactory {
  (): Generator;
}

export interface ThreadsCallback {
  (root: Thread): void;
}

decorate(threads, threadable());
export function* threads(
  factory: ThreadsFactory,
  callback?: ThreadsCallback,
): Generator {
  let threads: Thread[] = [];
  const find = (runner: Generator) =>
    threads.find(thread => thread.runner === runner);

  decorate(joinInternal, threadable());
  function* joinInternal(tasks: Generator[], all: boolean): Generator {
    if (all) {
      while (tasks.find(runner => find(runner))) {
        yield;
      }
    } else {
      while (!tasks.find(runner => !find(runner))) {
        yield;
      }
    }
  }

  const root = factory();
  GeneratorHelper.makeThreadable(root, 'root');
  const rootThread = new Thread(root);
  callback?.(rootThread);
  threads.push(rootThread);
  while (threads.length > 0) {
    let hasChanged = false;
    const newThreads = [];

    for (let i = 0; i < threads.length; i++) {
      const thread = threads[i];
      if (thread.canceled) {
        continue;
      }

      const result = thread.next();
      if (result.done) {
        hasChanged = true;
        thread.cancel();
        continue;
      }

      let value = result.value;
      if (value?.[THREAD_JOIN]) {
        value = joinInternal(value[THREAD_JOIN], value.all);
      } else if (value?.[THREAD_CANCEL]) {
        value[THREAD_CANCEL].forEach((runner: Generator) => {
          const cancelThread = find(runner);
          if (cancelThread) {
            cancelThread.cancel();
          }
        });
        threads.push(thread);
        continue;
      }

      if (value?.next) {
        const child = find(value) ?? new Thread(value);
        thread.value = value;
        if (child.canceled) {
          console.warn('Reusing a canceled thread: ', child);
        }
        thread.add(child);
        hasChanged = true;

        threads.push(thread);
        threads.push(child);
      } else if (value) {
        thread.value = yield value;
        threads.push(thread);
      } else {
        newThreads.push(thread);
      }
    }

    threads = newThreads;
    if (hasChanged) callback?.(rootThread);
    if (threads.length > 0) yield;
  }
}
