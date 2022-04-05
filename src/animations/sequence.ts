import {waitFor} from './scheduling';
import {decorate, threadable} from '../decorators';
import {join} from '../threading';

decorate(sequence, threadable());
export function* sequence(delay: number, ...sequences: Generator[]): Generator {
  for (const sequence1 of sequences) {
    yield sequence1;
    yield* waitFor(delay);
  }

  yield* join(...sequences);
}
