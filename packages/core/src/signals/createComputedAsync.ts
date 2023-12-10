import {
  Computed,
  ComputedContext,
  createSignal,
  PromiseHandle,
} from '../signals';
import {createComputed} from './createComputed';

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
  let handle: PromiseHandle<T | null>;
  const signal = createSignal(factory);
  return createComputed(() => {
    const promise = signal();
    if (!handle || handle.promise !== promise) {
      handle = ComputedContext.collectPromise(
        promise,
        handle?.value ?? initial,
      );
    }

    return handle.value;
  });
}
