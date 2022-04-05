import {join, ThreadGenerator} from '../threading';
import {decorate, threadable} from '../decorators';

decorate(all, threadable());
export function* all(...tasks: ThreadGenerator[]): ThreadGenerator {
  for (const task of tasks) {
    yield task;
  }
  yield* join(...tasks);
}
