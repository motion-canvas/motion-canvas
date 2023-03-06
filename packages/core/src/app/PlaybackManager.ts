import {Scene, SceneDescriptionReload} from '../scenes';
import {ValueDispatcher} from '../events';

export enum PlaybackState {
  Playing,
  Rendering,
  Paused,
}

/**
 * A general class for managing a sequence of scenes.
 *
 * @remarks
 * This class provides primitive operations that can be executed on a scene
 * sequence, such as {@link progress} or {@link seek}.
 */
export class PlaybackManager {
  /**
   * Triggered when the active scene changes.
   *
   * @eventProperty
   */
  public get onSceneChanged() {
    if (this.currentSceneReference === null) {
      throw new Error('PlaybackManager has not been properly initialized');
    }
    return this.currentSceneReference.subscribable;
  }

  /**
   * Triggered when the scenes get recalculated.
   *
   * @remarks
   * This event indicates that the timing of at least one scene has changed.
   *
   * @eventProperty
   */
  public get onScenesRecalculated() {
    return this.scenes.subscribable;
  }

  public frame = 0;
  public speed = 1;
  public fps = 30;
  public duration = 0;
  public finished = false;

  public previousScene: Scene | null = null;
  public state = PlaybackState.Paused;

  public get currentScene(): Scene {
    if (this.currentSceneReference === null) {
      throw new Error('PlaybackManager has not been properly initialized');
    }
    return this.currentSceneReference.current;
  }

  public set currentScene(scene: Scene) {
    this.currentSceneReference ??= new ValueDispatcher<Scene>(scene);
    this.currentSceneReference.current = scene;
  }

  private currentSceneReference: ValueDispatcher<Scene> | null = null;
  private scenes = new ValueDispatcher<Scene[]>([]);

  public setup(scenes: Scene[]) {
    this.scenes.current = scenes;
    this.currentScene = scenes[0];
  }

  public async progress() {
    this.finished = await this.next();
    return this.finished;
  }

  public async seek(frame: number): Promise<boolean> {
    if (
      frame <= this.frame ||
      (this.currentScene.isCached() && this.currentScene.lastFrame < frame)
    ) {
      const scene = this.findBestScene(frame);
      if (scene !== this.currentScene) {
        this.previousScene = null;
        this.currentScene = scene;

        this.frame = this.currentScene.firstFrame;
        await this.currentScene.reset();
      } else if (this.frame >= frame) {
        this.previousScene = null;
        this.frame = this.currentScene.firstFrame;
        await this.currentScene.reset();
      }
    }

    this.finished = false;
    while (this.frame < frame && !this.finished) {
      this.finished = await this.next();
    }

    return this.finished;
  }

  public async reset() {
    this.previousScene = null;
    this.currentScene = this.scenes.current[0];
    this.frame = 0;
    await this.currentScene.reset();
  }

  public reload(description?: SceneDescriptionReload<never>) {
    this.scenes.current.forEach(scene => scene.reload(description));
  }

  public async recalculate() {
    this.previousScene = null;

    const speed = this.speed;
    this.frame = 0;
    this.speed = 1;

    const scenes: Scene[] = [];
    try {
      for (const scene of this.scenes.current) {
        await scene.recalculate(frame => {
          this.frame = frame;
        });
        scenes.push(scene);
      }
    } finally {
      this.speed = speed;
    }

    this.scenes.current = scenes;
    this.duration = this.frame;
  }

  private async next(): Promise<boolean> {
    if (this.previousScene) {
      await this.previousScene.next();
      if (this.currentScene.isFinished()) {
        this.previousScene = null;
      }
    }

    this.frame += this.speed;

    if (this.currentScene.isFinished()) {
      return false;
    }

    await this.currentScene.next();
    if (this.previousScene && this.currentScene.isAfterTransitionIn()) {
      this.previousScene = null;
    }

    if (this.currentScene.canTransitionOut()) {
      this.previousScene = this.currentScene;
      const nextScene = this.getNextScene(this.previousScene);
      if (nextScene) {
        this.currentScene = nextScene;
        await this.currentScene.reset(this.previousScene);
      }
      if (!nextScene || this.currentScene.isAfterTransitionIn()) {
        this.previousScene = null;
      }
    }

    return this.currentScene.isFinished();
  }

  private findBestScene(frame: number): Scene {
    let lastScene = this.scenes.current[0];
    for (const scene of this.scenes.current) {
      if (!scene.isCached() || scene.lastFrame > frame) {
        return scene;
      }
      lastScene = scene;
    }

    return lastScene;
  }

  private getNextScene(scene?: Scene): Scene | null {
    const scenes = this.scenes.current;
    if (!scene) {
      return scenes[0];
    }

    const index = scenes.findIndex(s => s === scene);
    if (index < 0) {
      return null;
    }
    return scenes[index + 1] ?? null;
  }
}
