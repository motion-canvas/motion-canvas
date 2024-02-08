import {useLogger} from './useScene';

/**
 * Mark the given function as deprecated.
 *
 * @param fn - The function to deprecate.
 * @param message - The log message.
 * @param remarks - The optional log remarks.
 */
export function deprecate<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  message: string,
  remarks?: string,
): (...args: TArgs) => TReturn {
  return function (this: any, ...args) {
    useLogger().warn({message, remarks, stack: new Error().stack});
    return fn.apply(this, args);
  };
}
