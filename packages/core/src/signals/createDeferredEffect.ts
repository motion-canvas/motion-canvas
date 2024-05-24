import {DeferredEffectContext} from './DeferredEffectContext';

/**
 * Invoke the callback at the end of each frame if any of its dependencies
 * changed.
 *
 * @param callback - The callback to invoke.
 */
export function createDeferredEffect(callback: () => void): () => void {
  const context = new DeferredEffectContext(callback);
  return () => context.dispose();
}
