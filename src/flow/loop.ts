export function* loop(iterations: number, factory: () => Generator) {
  for (let i = 0; i < iterations; i++) {
    yield* factory();
  }
}
