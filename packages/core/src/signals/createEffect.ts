import {EffectContext} from './EffectContext';

/**
 * Invoke the callback immediately after any of its dependencies change.
 *
 * @param callback - The callback to invoke.
 */
export function createEffect(callback: () => void): () => void {
  const context = new EffectContext(callback);
  return () => context.dispose();
}
