import {useScene} from './useScene';
import type {Scene} from '../scenes';

function subscribe(fn: (scene: Scene) => () => void) {
  const scene = useScene();
  if (scene == null) {
    throw new Error('no scene found from which to use the context');
  }
  const unsubScene = fn(scene);
  const unsubReset = scene.onReset.subscribe(unsubAll);
  function unsubAll() {
    unsubScene();
    unsubReset();
  }
  return unsubAll;
}

export function useContext(
  callback: (ctx: CanvasRenderingContext2D) => void,
): () => void {
  return subscribe(scene => scene.onBeforeRendered.subscribe(callback));
}

export function useContextAfter(
  callback: (ctx: CanvasRenderingContext2D) => void,
): () => void {
  return subscribe(scene => scene.onAfterRendered.subscribe(callback));
}
