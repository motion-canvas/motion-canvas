import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';

decorate(loop, threadable());
export function* loop(
  iterations: number,
  factory: () => ThreadGenerator | void,
) {
  for (let i = 0; i < iterations; i++) {
    const generator = factory();
    if (generator) {
      yield* generator;
    } else {
      yield;
    }
  }
}
