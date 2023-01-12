import {createComputed} from './createComputed';
import {Computed, ComputedContext} from '../signals';

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
  const handle = createComputed(() =>
    ComputedContext.collectPromise(factory(), initial),
  );
  return createComputed(() => handle().value);
}
