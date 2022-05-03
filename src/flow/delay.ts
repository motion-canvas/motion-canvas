import {waitFor} from '../animations';
import {decorate, threadable} from '../decorators';
import {isThreadGenerator, ThreadGenerator} from '../threading';

decorate(delay, threadable());
export function* delay(
  time: number,
  task: ThreadGenerator | Function,
): ThreadGenerator {
  yield* waitFor(time);
  if (isThreadGenerator(task)) {
    yield* task;
  } else {
    task();
  }
}
