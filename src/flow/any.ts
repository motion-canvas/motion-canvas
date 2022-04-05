import {join, ThreadGenerator} from '../threading';
import {decorate, threadable} from '../decorators';

decorate(any, threadable());
export function* any(...tasks: ThreadGenerator[]): ThreadGenerator {
  for (const task of tasks) {
    yield task;
  }
  yield* join(false, ...tasks);
}
