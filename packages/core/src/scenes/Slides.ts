import {PlaybackState} from '../app/PlaybackManager';
import {ValueDispatcher} from '../events';
import type {Scene} from './Scene';

export interface Slide {
  id: string;
  name: string;
  time: number;
  scene: Scene;
  stack?: string;
}

export class Slides {
  public get onChanged() {
    return this.slides.subscribable;
  }
  private readonly slides = new ValueDispatcher<Slide[]>([]);

  private readonly lookup = new Map<string, Slide>();
  private readonly collisionLookup = new Set<string>();
  private current: Slide | null = null;
  private canResume = false;
  private waitsForId: string | null = null;
  private targetId: string | null = null;

  public constructor(private readonly scene: Scene) {
    this.scene.onReloaded.subscribe(this.handleReload);
    this.scene.onReset.subscribe(this.handleReset);
    this.scene.onRecalculated.subscribe(this.handleRecalculated);
  }

  public setTarget(target: string | null) {
    this.targetId = target;
  }

  public resume() {
    this.canResume = true;
  }

  public isWaitingFor(slide: string) {
    return this.waitsForId === slide;
  }

  public isWaiting() {
    return this.waitsForId !== null;
  }

  public didHappen(slide: string) {
    if (this.current === null) {
      return false;
    }

    for (const key of this.lookup.keys()) {
      if (key === slide) {
        return true;
      }
      if (key === this.current?.id) {
        return false;
      }
    }

    return false;
  }

  public getCurrent() {
    return this.current;
  }

  public register(name: string, initialTime: number) {
    if (this.waitsForId !== null) {
      throw new Error(
        `The animation already waits for a slide: ${this.waitsForId}.`,
      );
    }

    const id = this.toId(name);
    if (this.scene.playback.state !== PlaybackState.Presenting) {
      if (!this.lookup.has(id)) {
        this.lookup.set(id, {
          id,
          name,
          time: initialTime,
          scene: this.scene,
          stack: new Error().stack,
        });
      }

      if (this.collisionLookup.has(name)) {
        this.scene.logger.warn({
          message: `A slide named "${name}" already exists.`,
          stack: new Error().stack,
        });
      } else {
        this.collisionLookup.add(name);
      }
    }

    this.waitsForId = id;
    this.current = this.lookup.get(id) ?? null;
    this.canResume = false;
  }

  public shouldWait(name: string): boolean {
    const id = this.toId(name);
    if (this.waitsForId !== id) {
      throw new Error(
        `The animation waits for a different slide: ${this.waitsForId}.`,
      );
    }
    const data = this.lookup.get(id);
    if (!data) {
      throw new Error(`Could not find the "${name}" slide.`);
    }

    let canResume = this.canResume;
    if (this.scene.playback.state !== PlaybackState.Presenting) {
      canResume = id !== this.targetId;
    }

    if (canResume) {
      this.waitsForId = null;
    }
    return !canResume;
  }

  private handleReload = () => {
    this.lookup.clear();
    this.collisionLookup.clear();
    this.current = null;
    this.waitsForId = null;
    this.targetId = null;
  };

  private handleReset = () => {
    this.collisionLookup.clear();
    this.current = null;
    this.waitsForId = null;
  };

  private handleRecalculated = () => {
    this.slides.current = [...this.lookup.values()];
  };

  private toId(name: string) {
    return `${this.scene.name}:${name}`;
  }
}
