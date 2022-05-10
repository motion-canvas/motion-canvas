import {Scene} from '../Scene';

let currentScene: Scene = null;

export function useScene(): Scene {
  return currentScene;
}

export function setScene(scene: Scene) {
  currentScene = scene;
}
