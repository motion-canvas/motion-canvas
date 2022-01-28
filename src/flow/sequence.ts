export function* sequence(delay: number, ...sequences: Generator[]): Generator {
  let finished = 0;
  let ticks = 0;
  while (finished < sequences.length) {
    finished = 0;
    ticks++;

    const time = ticks / 60;
    const amount = Math.floor(time / delay) + 1;

    for (let i = 0; i < Math.min(sequences.length, amount); i++) {
      if (sequences[i].next().done) {
        finished++;
      }
    }

    yield;
  }
}
