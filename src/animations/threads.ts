import {GeneratorHelper} from '../helpers';
import {decorate, threadable} from '../decorators';

export interface ThreadsFactory {
  (): Generator;
}

decorate(join, threadable());
export function* join(all: boolean, ...tasks: Generator[]): Generator {
  yield* (yield {join: tasks, all}) as Generator;
}

decorate(cancel, threadable());
export function* cancel(...tasks: Generator[]): Generator {
  yield {cancel: tasks};
}

decorate(threads, threadable());
export function* threads(factory: ThreadsFactory): Generator {
  let runners: Generator[] = [];
  let cancelled = new Set<Generator>();
  let values = new Map<Generator, any>();
  let children = new Map<Generator, Generator[]>();

  decorate(joinInternal, threadable());
  function* joinInternal(tasks: Generator[], all: boolean): Generator {
    if (all) {
      while (tasks.find(runner => runners.includes(runner))) {
        yield;
      }
    } else {
      while (!tasks.find(runner => !runners.includes(runner))) {
        yield;
      }
    }
  }

  const cancelInternal = (tasks: Generator[]) => {
    tasks.forEach(task => cancelled.add(task));
  };

  const root = factory();
  GeneratorHelper.makeThreadable(root, 'root');
  runners.push(root);
  while (runners.length > 0) {
    const newRunners = [];
    const cancelledRunners = new Set<Generator>();
    for (let i = 0; i < runners.length; i++) {
      const runner = runners[i];
      // FIXME Keep track of child-parent relations instead.
      const childTasks = (children.get(runner) ?? []).filter(child =>
        runners.includes(child),
      );
      children.set(runner, childTasks);

      if (cancelledRunners.has(runner)) {
        continue;
      }

      if (cancelled.has(runner)) {
        cancelledRunners.add(runner);
        cancelled.delete(runner);
        children.delete(runner);
        cancelInternal(childTasks);
        continue;
      }

      const result = runner.next(values.get(runner));
      values.delete(runner);

      if (result.done) {
        cancelledRunners.add(runner);
        cancelled.delete(runner);
        children.delete(runner);
        cancelInternal(childTasks);
        continue;
      }

      let value = result.value;
      if (value?.join) {
        value = joinInternal(value.join, value.all);
      } else if (value?.cancel) {
        cancelInternal(value.cancel);
        runners.push(runner);
        continue;
      }

      if (value?.next) {
        values.set(runner, value);
        cancelled.delete(value);
        childTasks.push(value);

        if (!Object.getPrototypeOf(value).threadable) {
          console.warn('Non-threadable task: ', value);
        }

        GeneratorHelper.makeThreadable(value, `non-threadable ${childTasks.length}`);
        runners.push(runner);
        runners.push(value);
      } else if (value) {
        values.set(runner, yield value);
        runners.push(runner);
      } else {
        newRunners.push(runner);
      }
    }
    runners = newRunners;
    if (runners.length > 0) yield;
  }
}
