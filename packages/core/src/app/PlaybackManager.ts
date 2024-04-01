import {ValueDispatcher} from '../events';
import type {Scene, SceneDescriptionReload, Slide} from '../scenes';

export enum PlaybackState {
  Playing,
  Rendering,
  Paused,
  Presenting,
}

/**
 * A general class for managing a sequence of scenes.
 *
 * @remarks
 * This class provides primitive operations that can be executed on a scene
 * sequence, such as {@link progress} or {@link seek}.
 *
 * @internal
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
  public slides: Slide[] = [];

  public previousScene: Scene | null = null;
  public state = PlaybackState.Paused;

  public get currentScene(): Scene {
    if (this.currentSceneReference === null) {
      throw new Error('PlaybackManager has not been properly initialized');
    }
    return this.currentSceneReference.current;
  }

  public set currentScene(scene: Scene) {
    if (!scene) {
      throw new Error('Invalid scene.');
    }
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

  public async goBack() {
    let target = this.currentScene.slides.getCurrent();
    if (target && this.currentScene.slides.isWaiting()) {
      const index = this.slides.indexOf(target);
      target = this.slides[index - 1];
    }

    await this.seekSlide(target);
  }

  public async goForward() {
    const current = this.currentScene.slides.getCurrent();
    const index = this.slides.indexOf(current!);
    await this.seekSlide(this.slides[index + 1]);
  }

  public async goTo(slideId: string) {
    await this.seekSlide(this.slides.find(slide => slide.id === slideId));
  }

  private async seekSlide(slide: Slide | null = null) {
    if (!slide) return;
    const {id, scene} = slide;

    if (this.currentScene !== scene || this.currentScene.slides.didHappen(id)) {
      this.previousScene = null;
      this.currentScene = scene;
      this.frame = this.currentScene.firstFrame;
      this.currentScene.slides.setTarget(id);
      await this.currentScene.reset();
    }

    this.finished = false;
    this.currentScene.slides.setTarget(id);
    while (!this.currentScene.slides.isWaitingFor(id) && !this.finished) {
      this.finished = await this.next();
    }
    this.currentScene.slides.setTarget(null);

    return this.finished;
  }

  public async reset() {
    this.previousScene = null;
    this.currentScene = this.scenes.current[0];
    this.frame = 0;
    this.finished = false;
    await this.currentScene.reset();
  }

  public reload(description?: SceneDescriptionReload<never>) {
    this.scenes.current.forEach(scene => scene.reload(description));
  }

  public async recalculate() {
    this.previousScene = null;
    this.slides = [];

    const speed = this.speed;
    this.frame = 0;
    this.speed = 1;

    const scenes: Scene[] = [];
    try {
      for (const scene of this.scenes.current) {
        await scene.recalculate(frame => {
          this.frame = frame;
        });
        this.slides.push(...scene.slides.onChanged.current);
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
      return true;
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
