import type {Scene} from '../scenes';

const sceneStack: Scene[] = [];

/**
 * Get a reference to the current scene.
 */
export function useScene(): Scene {
  const scene = sceneStack.at(-1);
  if (!scene) {
    throw new Error('The scene is not available in the current context.');
  }
  return scene;
}

export function startScene(scene: Scene) {
  sceneStack.push(scene);
}

export function endScene(scene: Scene) {
  if (sceneStack.pop() !== scene) {
    throw new Error('startScene/endScene was called out of order.');
  }
}
