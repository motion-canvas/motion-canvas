import {decorate, threadable} from "../decorators";

function isGenerator(value: any): value is Generator {
  return Symbol.iterator in value;
}


decorate(chain, threadable());
export function* chain(...args: (Generator | Function)[]) {
  for (const generator of args) {
    if (isGenerator(generator)) {
      yield* generator;
    } else {
      generator();
    }
  }
}
