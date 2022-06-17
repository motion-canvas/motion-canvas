import type {Scene} from './Scene';
import {SimpleEventDispatcher} from 'strongly-typed-events';

/**
 * Represents a time event at runtime.
 */
export interface TimeEvent {
  /**
   * Name of the event.
   */
  name: string;
  /**
   * Time in seconds, relative to the beginning of the scene, at which the event
   * was registered.
   *
   * In other words, the moment at which {@link waitUntil} for this event was
   * invoked.
   */
  initialTime: number;
  /**
   * Time in seconds, relative to the beginning of the scene, at which the event
   * should end.
   */
  targetTime: number;
  /**
   * Duration of the event in seconds.
   */
  offset: number;
}

/**
 * Represents a time event stored in a meta file.
 */
export interface SavedTimeEvent {
  name: string;
  targetTime: number;
}

/**
 * Manages time events for a given scene.
 */
export class TimeEvents {
  /**
   * Triggered when time events change.
   *
   * @event TimeEvent[]
   */
  public get Changed() {
    return this.changed.asEvent();
  }

  private readonly changed = new SimpleEventDispatcher<TimeEvent[]>();
  private registeredEvents: Record<string, TimeEvent> = {};
  private lookup: Record<string, TimeEvent> = {};
  private previousReference: SavedTimeEvent[];
  private ignoreSave = false;
  private preserveTiming = true;

  public constructor(private readonly scene: Scene) {
    const storageKey = `scene-${scene.project.name()}-${scene.name()}`;
    const storedEvents = localStorage.getItem(storageKey);
    if (storedEvents) {
      console.warn('Migrating localStorage to meta files');
      localStorage.setItem(`${storageKey}-backup`, storedEvents);
      localStorage.removeItem(storageKey);
      this.load(Object.values<TimeEvent>(JSON.parse(storedEvents)));
    } else {
      this.load(scene.meta.getData().timeEvents ?? []);
    }

    scene.meta.Changed.subscribe(event => {
      // Ignore the event if `timeEvents` hasn't changed.
      // This may happen when another part of metadata has changed triggering
      // this event.
      if (event.timeEvents === this.previousReference) return;
      this.previousReference = event.timeEvents;
      this.ignoreSave = true;

      this.load(event.timeEvents ?? []);
      scene.reload();
      window.player.reload();
    });
  }

  public toArray(): TimeEvent[] {
    return Object.values(this.registeredEvents);
  }

  public get(name: string) {
    return this.registeredEvents[name] ?? null;
  }

  /**
   * Change the time offset of the given event.
   *
   * @param name Name of the event.
   * @param offset Time offset in seconds.
   * @param preserve Whether the timing of the consecutive events should be
   *                 preserved. When set to `true` their offsets will be
   *                 adjusted to keep them in place.
   */
  public set(name: string, offset: number, preserve = true) {
    if (!this.lookup[name] || this.lookup[name].offset === offset) {
      return;
    }
    this.preserveTiming = preserve;
    this.lookup[name] = {
      ...this.lookup[name],
      targetTime: this.lookup[name].initialTime + offset,
      offset,
    };
    this.registeredEvents[name] = this.lookup[name];
    this.changed.dispatch(this.toArray());
    this.scene.reload();
  }

  /**
   * Register a time event.
   *
   * @param name Name of the event.
   *
   * @return The absolute frame at which the event should occur.
   *
   * @internal
   */
  public register(name: string): number {
    const initialTime = this.scene.project.framesToSeconds(
      this.scene.project.frame - this.scene.firstFrame,
    );
    if (!this.lookup[name]) {
      this.lookup[name] = {
        name,
        initialTime,
        targetTime: initialTime,
        offset: 0,
      };
    } else {
      let changed = false;
      const event = {...this.lookup[name]};
      if (event.initialTime !== initialTime) {
        event.initialTime = initialTime;
        changed = true;
      }

      const offset = Math.max(0, event.targetTime - event.initialTime);
      if (this.preserveTiming && event.offset !== offset) {
        event.offset = offset;
        changed = true;
      }

      const target = event.initialTime + event.offset;
      if (!this.preserveTiming && event.targetTime !== target) {
        event.targetTime = target;
        changed = true;
      }

      if (changed) {
        this.lookup[name] = event;
      }
    }

    this.registeredEvents[name] = this.lookup[name];

    return (
      this.scene.firstFrame +
      this.scene.project.secondsToFrames(this.lookup[name].targetTime)
    );
  }

  /**
   * Called when the parent scene gets reloaded.
   */
  public onReload() {
    this.registeredEvents = {};
  }

  /**
   * Called when the parent scene gets cached.
   */
  public onCache() {
    this.preserveTiming = true;
    this.changed.dispatch(this.toArray());

    if (this.ignoreSave) {
      this.ignoreSave = false;
      return;
    }

    this.save();
  }

  private save() {
    this.previousReference = Object.values(this.registeredEvents).map(
      event => ({
        name: event.name,
        targetTime: event.targetTime,
      }),
    );

    this.scene.meta.setDataSync({
      timeEvents: this.previousReference,
    });
  }

  private load(events: SavedTimeEvent[]) {
    for (const event of events) {
      const previous = this.lookup[event.name] ?? {
        name: event.name,
        initialTime: 0,
        offset: 0,
      };

      this.lookup[event.name] = {
        ...previous,
        targetTime: event.targetTime,
      };
    }
  }
}
