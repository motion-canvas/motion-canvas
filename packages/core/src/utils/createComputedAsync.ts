import {Computed, createComputed} from './createComputed';
import {collectPromise} from './createSignal';

export function createComputedAsync<T>(
  factory: () => Promise<T>,
  initial: T = null,
): Computed<T> {
  const handle = createComputed(() => collectPromise(factory(), initial));
  return createComputed(() => handle().value);
}
