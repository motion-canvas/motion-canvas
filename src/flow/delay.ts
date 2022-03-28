import {waitFor} from '../animations';
import {decorate, threadable} from '../decorators';

decorate(delay, threadable());
export function* delay(time: number, task: Generator): Generator {
  yield* waitFor(time);
  yield* task;
}
