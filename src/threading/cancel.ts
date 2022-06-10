import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from './ThreadGenerator';

export const THREAD_CANCEL = Symbol.for('THREAD_CANCEL');

export interface CancelYieldResult {
  [THREAD_CANCEL]: ThreadGenerator[];
}

export function isCancelYieldResult(
  value: unknown,
): value is CancelYieldResult {
  return typeof value === 'object' && THREAD_CANCEL in value;
}

decorate(cancel, threadable());
export function* cancel(...tasks: ThreadGenerator[]): ThreadGenerator {
  yield {[THREAD_CANCEL]: tasks};
}
