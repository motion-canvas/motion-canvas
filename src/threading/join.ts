import {decorate, threadable} from '../decorators';

export const THREAD_JOIN = Symbol('Thread join command');

decorate(join, threadable());
export function join(all: boolean, ...tasks: Generator[]): Generator;
export function join(...tasks: Generator[]): Generator;
export function* join(
  first: Generator | boolean,
  ...tasks: Generator[]
): Generator {
  let all = true;
  if (typeof first === 'boolean') {
    all = first;
  } else {
    tasks.push(first);
  }

  yield* (yield {[THREAD_JOIN]: tasks, all}) as Generator;
}
