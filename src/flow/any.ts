import {join} from '../animations';
import {decorate, threadable} from '../decorators';

decorate(any, threadable());
export function* any(...tasks: Generator[]): Generator {
  for (const task of tasks) {
    yield task;
  }
  yield* join(false, ...tasks);
}
