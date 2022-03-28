import {decorate, threadable} from '../decorators';

decorate(loop, threadable());
export function* loop(iterations: number, factory: () => Generator | void) {
  for (let i = 0; i < iterations; i++) {
    const generator = factory();
    if (generator) {
      yield* generator;
    } else {
      yield;
    }
  }
}
