export interface ThreadsJoin {
  (...tasks: Generator[]): Generator;
}

export interface ThreadsCancel {
  (...tasks: Generator[]): void;
}

export interface ThreadsFactory {
  (join: ThreadsJoin, cancel: ThreadsCancel): Generator;
}

export function* threads(factory: ThreadsFactory): Generator {
  let runners: Generator[] = [];
  let cancelled = new Set<Generator>();
  let values = new Map<Generator, any>();
  let children = new Map<Generator, Generator[]>();
  const join = function* (...tasks: Generator[]): Generator {
    while (tasks.find(runner => runners.includes(runner))) {
      yield;
    }
  };
  const cancel = (...tasks: Generator[]) => {
    tasks.forEach(task => cancelled.add(task));
  };

  runners.push(factory(join, cancel));
  while (runners.length > 0) {
    const newRunners = [];
    for (let i = 0; i < runners.length; i++) {
      const runner = runners[i];
      const childTasks = children.get(runner) ?? [];
      children.set(runner, childTasks);

      if (cancelled.has(runner)) {
        cancelled.delete(runner);
        children.delete(runner);
        cancel(...childTasks);
        continue;
      }

      const result = runner.next(values.get(runner));
      values.delete(runner);

      if (result.done) {
        cancelled.delete(runner);
        children.delete(runner);
        cancel(...childTasks);
        continue;
      }

      if (typeof result.value?.then === 'function') {
        values.set(runner, yield result.value);
        runners.push(runner);
      } else if (result.value?.next) {
        values.set(runner, result.value);
        cancelled.delete(result.value);
        childTasks.push(result.value);
        runners.push(runner);
        runners.push(result.value);
      } else {
        newRunners.push(runner);
      }
    }
    runners = newRunners;
    if (runners.length > 0) yield;
  }
}
