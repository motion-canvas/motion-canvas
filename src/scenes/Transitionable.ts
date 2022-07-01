import {ThreadGenerator} from '../threading';
import {Vector2} from '../types';

/**
 * Describes the transition context of a scene.
 *
 * This context is used by scene transitions to modify the way scenes are
 * displayed in a renderer-agnostic way.
 *
 * It allows transitions to work across different scenes.
 */
export interface TransitionContext {
  /**
   * Set the position of the scene.
   * @param value
   */
  position(value: Vector2): void;

  /**
   * Set the scale of the scene.
   * @param value
   */
  scale(value: Vector2): void;

  /**
   * Set the rotation of the scene.
   *
   * @param value
   */
  rotation(value: number): void;

  /**
   * Set the opacity of the scene.
   * @param value
   */
  opacity(value: number): void;

  /**
   * Set whether the scene should be visible.
   *
   * @param value
   */
  visible(value: boolean): void;
}

/**
 * Describes a function that performs a transition.
 */
export interface SceneTransition {
  /**
   * A function that performs a transition.
   *
   * @param next the context of the scene that should appear next.
   * @param previous If present, the context of the scene that should disappear.
   */
  (next: TransitionContext, previous?: TransitionContext): ThreadGenerator;
}

/**
 * Scenes can implement this interface to support transitions.
 */
export interface Transitionable {
  /**
   * Get the transition context for this scene.
   */
  getTransitionContext(): TransitionContext;

  /**
   * Perform the transition.
   *
   * @param transitionRunner A generator function that runs the transition.
   */
  transition(transitionRunner?: SceneTransition): ThreadGenerator;
}

export function isTransitionable(value: any): value is Transitionable {
  return value && typeof value === 'object' && 'getTransitionContext' in value;
}
