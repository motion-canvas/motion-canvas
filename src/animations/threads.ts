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
  let cancelled: Set<Generator> = new Set<Generator>();
  let previous: Map<Generator, Generator> = new Map<Generator, Generator>();
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
      if (cancelled.has(runner)) {
        cancelled.delete(runner);
        continue;
      }

      const result = runner.next(previous.get(runner));

      if (result.value?.next) {
        if (!result.done) {
          runners.push(runner);
        }
        previous.set(runner, result.value);
        cancelled.delete(result.value);
        runners.push(result.value);
      } else if (!result.done) {
        newRunners.push(runner);
      }
    }
    runners = newRunners;
    if (runners.length > 0) yield;
  }
}
