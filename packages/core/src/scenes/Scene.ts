import type {Logger, PlaybackStatus, SharedWebGLContext} from '../app';
import type {
  SubscribableEvent,
  SubscribableValueEvent,
  ValueDispatcher,
} from '../events';
import type {Plugin} from '../plugin';
import type {SignalValue} from '../signals';
import type {Vector2} from '../types';
import type {LifecycleEvents} from './LifecycleEvents';
import type {Random} from './Random';
import type {SceneMetadata} from './SceneMetadata';
import type {Shaders} from './Shaders';
import type {Slides} from './Slides';
import type {Variables} from './Variables';
import type {TimeEvents} from './timeEvents';

/**
 * The constructor used when creating new scenes.
 *
 * @remarks
 * Each class implementing the {@link Scene} interface should have a matching
 * constructor.
 *
 * @typeParam T - The type of the configuration object. This object will be
 *                passed to the constructor from
 *                {@link SceneDescription.config}.
 */
export interface SceneConstructor<T> {
  new (description: FullSceneDescription<T>): Scene;
}

/**
 * Describes a scene exposed by scene files.
 *
 * @typeParam T - The type of the configuration object.
 */
export interface SceneDescription<T = unknown> {
  /**
   * The class used to instantiate the scene.
   */
  klass: SceneConstructor<T>;
  /**
   * Configuration object.
   */
  config: T;
  /**
   * The stack trace at the moment of creation.
   */
  stack?: string;
  /**
   * A list of plugins to include in the project.
   */
  plugins?: (Plugin | string)[];
  meta: SceneMetadata;
}

/**
 * Describes a complete scene together with the meta file.
 *
 * @typeParam T - The type of the configuration object.
 */
export interface FullSceneDescription<T = unknown> extends SceneDescription<T> {
  name: string;
  size: Vector2;
  resolutionScale: number;
  variables: Variables;
  playback: PlaybackStatus;
  logger: Logger;
  onReplaced: ValueDispatcher<FullSceneDescription<T>>;
  timeEventsClass: new (scene: Scene) => TimeEvents;
  sharedWebGLContext: SharedWebGLContext;
  experimentalFeatures?: boolean;
}

/**
 * A part of the {@link SceneDescription} that can be updated during reload.
 *
 * @typeParam T - The type of the configuration object.
 */
export interface SceneDescriptionReload<T = unknown> {
  size?: Vector2;
  resolutionScale?: number;
  config?: T;
  stack?: string;
}

export type DescriptionOf<TScene> = TScene extends Scene<infer TConfig>
  ? SceneDescription<TConfig>
  : never;

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
   * Occurs at the beginning of a render when the Scene's
   * {@link utils.useContext} handlers are applied.
   */
  BeginRender,
  /**
   * Occurs at the end of a render when the Scene's
   * {@link utils.useContextAfter} handlers are applied.
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
 * @remarks
 * Any class implementing this interface should have a constructor matching
 * {@link SceneConstructor}.
 *
 * @typeParam T - The type of the configuration object.
 */
export interface Scene<T = unknown> {
  /**
   * Name of the scene.
   *
   * @remarks
   * Will be passed as the second argument to the constructor.
   */
  readonly name: string;
  /**
   * Reference to the project.
   */
  readonly playback: PlaybackStatus;
  readonly timeEvents: TimeEvents;
  /**
   * @experimental
   */
  readonly shaders: Shaders;
  readonly slides: Slides;
  readonly logger: Logger;
  readonly variables: Variables;
  readonly random: Random;
  readonly meta: SceneMetadata;
  creationStack?: string;

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
   * @eventProperty
   */
  get onCacheChanged(): SubscribableValueEvent<CachedSceneData>;

  /**
   * Triggered when the scene is reloaded.
   *
   * @eventProperty
   */
  get onReloaded(): SubscribableEvent<void>;

  /**
   * Triggered after scene is recalculated.
   *
   * @eventProperty
   */
  get onRecalculated(): SubscribableEvent<void>;

  /**
   * The {@link scenes.LifecycleEvents} of this scene.
   */
  get lifecycleEvents(): LifecycleEvents;

  /**
   * The {@link scenes.LifecycleEvents} of this scene.
   *
   * @deprecated Use {@link lifecycleEvents} instead.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  get LifecycleEvents(): LifecycleEvents;

  /**
   * Triggered at various stages of the render lifecycle with an event title and a Context2D.
   *
   * @eventProperty
   */
  get onRenderLifecycle(): SubscribableEvent<
    [SceneRenderEvent, CanvasRenderingContext2D]
  >;

  /**
   * Triggered when the scene is reset.
   *
   * @eventProperty
   */
  get onReset(): SubscribableEvent<void>;

  /**
   * The scene directly before this scene, or null if omitted for performance.
   */
  get previous(): Scene | null;

  /**
   * Whether experimental features are enabled.
   */
  get experimentalFeatures(): boolean;

  /**
   * Render the scene onto a canvas.
   *
   * @param context - The context to used when rendering.
   */
  render(context: CanvasRenderingContext2D): Promise<void>;

  /**
   * Reload the scene.
   *
   * @remarks
   * This method is called whenever something related to this scene has changed:
   * time events, source code, metadata, etc.
   *
   * Should trigger {@link onReloaded}.
   *
   * @param description - If present, an updated version of the description.
   */
  reload(description?: SceneDescriptionReload<T>): void;

  /**
   * Recalculate the scene.
   *
   * @remarks
   * The task of this method is to calculate new timings stored in the cache.
   * When this method is invoked, `this.project.frame` is set to the frame at
   * which this scene should start ({@link firstFrame}).
   *
   * At the end of execution, this method should set `this.project.frame` to the
   * frame at which this scene ends ({@link lastFrame}).
   *
   * Should trigger {@link onRecalculated}.
   */
  recalculate(setFrame: (frame: number) => void): Promise<void>;

  /**
   * Progress this scene one frame forward.
   */
  next(): Promise<void>;

  /**
   * Reset this scene to its initial state.
   *
   * @param previous - If present, the previous scene.
   */
  reset(previous?: Scene): Promise<void>;

  /**
   * Get the size of this scene.
   *
   * @remarks
   * Usually returns `this.project.getSize()`.
   */
  getSize(): Vector2;

  /**
   * Get the real size of this scene.
   *
   * @remarks
   * Returns the size of the scene multiplied by the resolution scale.
   * This is the actual size of the canvas onto which the scene is rendered.
   */
  getRealSize(): Vector2;

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
   * Enter the {@link SceneState.Initial} state.
   */
  enterInitial(): void;

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
   * @remarks
   * Used only by {@link GeneratorScene}. Seeking through a project that
   * contains at least one uncached scene will log a warning to the console.
   *
   * Should always return `true`.
   */
  isCached(): boolean;

  /**
   * Should this scene be rendered below the previous scene during a transition?
   */
  previousOnTop: SignalValue<boolean>;
}
