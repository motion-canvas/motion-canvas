export function* any(...sequences: Generator[]): Generator {
  while (sequences.length > 0) {
    for (let i = sequences.length - 1; i >= 0; i--) {
      const result = sequences[i].next();
      if (result.done) {
        return;
      }
    }

    yield;
  }
}
