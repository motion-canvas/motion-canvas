import {Computed, createComputed} from './createComputed';
import {collectPromise} from './createSignal';

export function createComputedAsync<T>(
  factory: () => Promise<T>,
): Computed<T | null>;
export function createComputedAsync<T>(
  factory: () => Promise<T>,
  initial: T,
): Computed<T>;
export function createComputedAsync<T>(
  factory: () => Promise<T>,
  initial: T | null = null,
): Computed<T | null> {
  const handle = createComputed(() => collectPromise(factory(), initial));
  return createComputed(() => handle().value);
}
