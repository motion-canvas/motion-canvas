import {decorate, threadable} from '../decorators';
import {isThreadGenerator, ThreadGenerator} from '../threading';

decorate(chain, threadable());
export function* chain(...args: (ThreadGenerator | Function)[]) {
  for (const generator of args) {
    if (isThreadGenerator(generator)) {
      yield* generator;
    } else {
      generator();
    }
  }
}
