import {waitFor} from './scheduling';
import {decorate, threadable} from '../decorators';
import {join, ThreadGenerator} from '../threading';

decorate(sequence, threadable());
export function* sequence(
  delay: number,
  ...sequences: ThreadGenerator[]
): ThreadGenerator {
  for (const sequence1 of sequences) {
    yield sequence1;
    yield* waitFor(delay);
  }

  yield* join(...sequences);
}
