import type {Project} from '../Project';
import {Meta, Metadata} from '../Meta';
import {SavedTimeEvent, TimeEvents} from './TimeEvents';
import {SubscribableEvent, SubscribableValueEvent} from '../events';
import {Size} from '../types';
import {LifecycleEvents} from './LifecycleEvents';

export interface SceneMetadata extends Metadata {
  timeEvents: SavedTimeEvent[];
}

/**
 * The constructor used when creating new scenes.
 *
 * Each class implementing the {@link Scene} interface should have a matching
 * constructor.
 *
 * @template T The type of the configuration object. This object will be passed
 *             to the constructor from {@link SceneDescription.config}.
 */
export interface SceneConstructor<T> {
  new (project: Project, name: string, config: T): Scene;
}

/**
 * Describes a scene exposed by a `*.scene.tsx` file.
 *
 * @template T The type of the configuration object.
 */
export interface SceneDescription<T = unknown> {
  /**
   * The class used to instantiate the scene.
   */
  klass: SceneConstructor<T>;
  /**
   * Name of the scene.
   *
   * Should match the first portion of the file name (`[name].scene.ts`).
   */
  name: string;
  /**
   * Configuration object.
   */
  config: T;
}

/**
 * Describes cached information about the timing of a scene.
 */
export interface CachedSceneData {
  firstFrame: number;
  lastFrame: number;
  transitionDuration: number;
  duration: number;
}

/**
 * Signifies the various stages of a {@link Scene}'s render lifecycle.
 */
export enum SceneRenderEvent {
  /**
   * Occurs before the render starts when the Scene transitions are applied.
   */
  BeforeRender,
  /**
   * Occurs at the beginning of a render when the Scene's `useContext` handlers are applied.
   */
  BeginRender,
  /**
   * Occurs at the end of a render when the Scene's `useContextAfter` handlers are applied.
   */
  FinishRender,
  /**
   * Occurs after a render ends.
   */
  AfterRender,
}

/**
 * The main interface for scenes.
 *
 * Any class implementing this interface should have a constructor matching
 * {@link SceneConstructor}.
 *
 * @template T The type of the configuration object.
 */
export interface Scene<T = unknown> {
  /**
   * Name of the scene.
   *
   * Will be passed as the second argument to the constructor.
   */
  readonly name: string;
  /**
   * Reference to the project.
   *
   * Will be passed as the first argument to the constructor.
   */
  readonly project: Project;
  readonly timeEvents: TimeEvents;
  readonly meta: Meta<SceneMetadata>;

  /**
   * The frame at which this scene starts.
   */
  get firstFrame(): number;

  /**
   * The frame at which this scene ends.
   */
  get lastFrame(): number;

  /**
   * Triggered when the cached data changes.
   *
   * @event CachedSceneData
   */
  get onCacheChanged(): SubscribableValueEvent<CachedSceneData>;

  /**
   * Triggered when the scene is reloaded.
   *
   * @event void
   */
  get onReloaded(): SubscribableEvent<void>;

  /**
   * Triggered after scene is recalculated.
   *
   * @event void
   */
  get onRecalculated(): SubscribableEvent<void>;

  /**
   * The scene's {@link LifecycleEvents}.
   */
  get LifecycleEvents(): LifecycleEvents;

  /**
   * Triggered at various stages of the render lifecycle with an event title and a Context2D.
   *
   * @event [SceneRenderEvent, CanvasRenderingContext2D]
   */
  get onRenderLifecycle(): SubscribableEvent<
    [SceneRenderEvent, CanvasRenderingContext2D]
  >;

  /**
   * Triggered when the scene is reset.
   *
   * @event void
   */
  get onReset(): SubscribableEvent<void>;

  /**
   * The scene directly before this scene, or null if omitted for performance.
   */
  get previous(): Scene;

  /**
   * Render the scene onto a canvas.
   *
   * @param context
   * @param canvas
   */
  render(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;

  /**
   * Reload the scene.
   *
   * This method is called whenever something related to this scene has changed:
   * time events, source code, metadata, etc.
   *
   * Should trigger {@link onReloaded}.
   *
   * @param config If present, a new configuration object.
   */
  reload(config?: T): void;

  /**
   * Recalculate the scene.
   *
   * The task of this method is to calculate new timings stored in the cache.
   * When this method is invoked, `this.project.frame` is set to the frame at
   * which this scene should start ({@link firstFrame}).
   *
   * At the end of execution, this method should set `this.project.frame` to the
   * frame at which this scene ends ({@link lastFrame}).
   *
   * Should trigger {@link onRecalculated}.
   */
  recalculate(): Promise<void>;

  /**
   * Progress this scene one frame forward.
   */
  next(): Promise<void>;

  /**
   * Reset this scene to its initial state.
   *
   * @param previous If present, the previous scene.
   */
  reset(previous?: Scene): Promise<void>;

  /**
   * Get the size of this scene.
   *
   * Usually return `this.project.getSize()`.
   */
  getSize(): Size;

  /**
   * Is this scene in the {@link SceneState.AfterTransitionIn} state?
   */
  isAfterTransitionIn(): boolean;

  /**
   * Is this scene in the {@link SceneState.CanTransitionOut} state?
   */
  canTransitionOut(): boolean;

  /**
   * Is this scene in the {@link SceneState.Finished} state?
   */
  isFinished(): boolean;

  /**
   * Enter the {@link SceneState.AfterTransitionIn} state.
   */
  enterAfterTransitionIn(): void;

  /**
   * Enter the {@link SceneState.CanTransitionOut} state.
   */
  enterCanTransitionOut(): void;

  /**
   * Is this scene cached?
   *
   * Used only by {@link GeneratorScene}. Seeking through a project that
   * contains at least one uncached scene will log a warning to the console.
   *
   * Should always return `true`.
   */
  isCached(): boolean;
}
