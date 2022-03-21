import {waitFor} from './scheduling';
import {join} from './threads';
import {decorate, threadable} from "../decorators";

decorate(sequence, threadable());
export function* sequence(delay: number, ...sequences: Generator[]): Generator {
  for (const sequence1 of sequences) {
    yield sequence1;
    yield* waitFor(delay);
  }

  yield* join(true, ...sequences);
}
