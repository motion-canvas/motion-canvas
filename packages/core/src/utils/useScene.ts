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
    throw new Error('startScene/endScene were called out of order.');
  }
}

export function useLogger() {
  return sceneStack.at(-1)?.logger ?? console;
}

/**
 * Mark the current scene as ready to transition out.
 *
 * @remarks
 * Usually used together with transitions. When a scene is marked as finished,
 * the transition will start but the scene generator will continue running.
 */
export function finishScene() {
  useScene().enterCanTransitionOut();
}
