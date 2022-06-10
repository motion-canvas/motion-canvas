import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from './ThreadGenerator';

export const THREAD_JOIN = Symbol.for('THREAD_JOIN');

export interface JoinYieldResult {
  [THREAD_JOIN]: ThreadGenerator[];
  all: boolean;
}

export function isJoinYieldResult(value: unknown): value is JoinYieldResult {
  return typeof value === 'object' && THREAD_JOIN in value;
}

decorate(join, threadable());
export function join(
  all: boolean,
  ...tasks: ThreadGenerator[]
): ThreadGenerator;
export function join(...tasks: ThreadGenerator[]): ThreadGenerator;
export function* join(
  first: ThreadGenerator | boolean,
  ...tasks: ThreadGenerator[]
): ThreadGenerator {
  let all = true;
  if (typeof first === 'boolean') {
    all = first;
  } else {
    tasks.push(first);
  }

  yield* yield {[THREAD_JOIN]: tasks, all};
}
