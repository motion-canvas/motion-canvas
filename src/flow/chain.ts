function isGenerator(value: any): value is Generator {
  return Symbol.iterator in value;
}

export function* chain(...args: (Generator | Function)[]) {
  for (const generator of args) {
    if (isGenerator(generator)) {
      yield* generator;
    } else {
      generator();
    }
  }
}
