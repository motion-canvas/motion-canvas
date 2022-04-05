import {decorate, threadable} from '../decorators';

export const THREAD_CANCEL = Symbol('Thread cancel command');

decorate(cancel, threadable());
export function* cancel(...tasks: Generator[]): Generator {
  yield {[THREAD_CANCEL]: tasks};
}
