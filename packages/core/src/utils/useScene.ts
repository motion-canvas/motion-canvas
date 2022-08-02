import type {Scene} from '../scenes';

const sceneStack: Scene[] = [];

/**
 * Get a reference to the current scene.
 */
export function useScene(): Scene {
  return sceneStack.at(-1);
}

export function startScene(scene: Scene) {
  sceneStack.push(scene);
}

export function endScene(scene: Scene) {
  if (sceneStack.pop() !== scene) {
    throw new Error('startScene/endScene was called out of order');
  }
}
