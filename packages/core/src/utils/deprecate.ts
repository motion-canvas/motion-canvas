import {useLogger} from './useProject';

/**
 * Mark the given function as deprecated.
 *
 * @param fn - The function to deprecate.
 * @param message - The log message.
 * @param remarks - The optional log remarks.
 */
export function deprecate<TArgs extends any[], TThis, TReturn>(
  fn: (this: TThis, ...args: TArgs) => TReturn,
  message: string,
  remarks?: string,
): (this: TThis, ...args: TArgs) => TReturn {
  return function (...args) {
    useLogger().warn({message, remarks, stack: new Error().stack});
    return fn.apply(this, args);
  };
}
