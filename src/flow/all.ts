export function* all(...sequences: Generator[]): Generator {
  while (sequences.length > 0) {
    for (let i = sequences.length - 1; i >= 0; i--) {
      const result = sequences[i].next();
      if (result.done) {
        sequences.splice(i, 1);
      }
    }

    yield;
  }
}
