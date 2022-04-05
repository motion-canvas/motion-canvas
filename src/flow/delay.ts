import {waitFor} from '../animations';
import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';

decorate(delay, threadable());
export function* delay(time: number, task: ThreadGenerator): ThreadGenerator {
  yield* waitFor(time);
  yield* task;
}
