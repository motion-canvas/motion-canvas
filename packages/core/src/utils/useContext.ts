import {useScene} from './useScene';

/**
 * Provide a function to access the Context2D before the scene is rendered.
 *
 * @param callback - The function that will be provided the context before render.
 */
export function useContext(
  callback: (ctx: CanvasRenderingContext2D) => void,
): () => void {
  return useScene().LifecycleEvents.onBeginRender.subscribe(callback);
}

/**
 * Provide a function to access the Context2D after the scene is rendered.
 *
 * @param callback - The function that will be provided the context after render.
 */
export function useContextAfter(
  callback: (ctx: CanvasRenderingContext2D) => void,
): () => void {
  return useScene().LifecycleEvents.onFinishRender.subscribe(callback);
}
