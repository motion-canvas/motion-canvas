import type {ViteHotContext} from 'vite/types/hot';

/**
 * Invoke the given callback if hot module replacement is enabled.
 *
 * @remarks
 * This helper function should be used instead of accessing `import.meta.hot`
 * directly. CommonJS doesn't support `import.meta` which makes the tests fail.
 * It's infinitely easier to mock this function out than to run jest on Node
 * with ES modules :(
 *
 * @param callback - The callback to be invoked if HMR is enabled.
 *
 * @typeParam T - The type returned by the callback or `void` if HMR is
 *                disabled.
 *
 * @internal
 */
export function ifHot<T>(callback: (hot: ViteHotContext) => T): T | void {
  if (import.meta.hot) {
    return callback(import.meta.hot);
  }
}
