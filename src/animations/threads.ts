export function* threads(
  factory: (join: (...tasks: Generator[]) => Generator) => Generator,
): Generator {
  let runners: Generator[] = [];
  const join = function* (...tasks: Generator[]): Generator {
    while (tasks.find(runner => runners.includes(runner))) {
      yield;
    }
  };
  runners.push(factory(join));
  while (runners.length > 0) {
    const newRunners = [];
    for (let i = 0; i < runners.length; i++) {
      const runner = runners[i];
      const result = runner.next();

      if (result.value?.next) {
        if (!result.done) {
          runners.push(runner);
        }
        runners.push(result.value);
      } else if (!result.done) {
        newRunners.push(runner);
      }
    }
    runners = newRunners;
    if (runners.length > 0) yield;
  }
}
