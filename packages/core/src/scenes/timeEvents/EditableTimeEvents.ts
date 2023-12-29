import {ValueDispatcher} from '../../events';
import type {Scene} from '../Scene';
import type {SerializedTimeEvent} from './SerializedTimeEvent';
import type {TimeEvent} from './TimeEvent';
import type {TimeEvents} from './TimeEvents';

/**
 * Manages time events during editing.
 */
export class EditableTimeEvents implements TimeEvents {
  public get onChanged() {
    return this.events.subscribable;
  }
  private readonly events = new ValueDispatcher<TimeEvent[]>([]);

  private registeredEvents = new Map<string, TimeEvent>();
  private lookup = new Map<string, TimeEvent>();
  private collisionLookup = new Set<string>();
  private previousReference: SerializedTimeEvent[] = [];
  private didEventsChange = false;
  private preserveTiming = true;

  public constructor(private readonly scene: Scene) {
    this.previousReference = scene.meta.timeEvents.get();
    this.load(this.previousReference);

    scene.onReloaded.subscribe(this.handleReload);
    scene.onRecalculated.subscribe(this.handleRecalculated);
    scene.onReset.subscribe(this.handleReset);
    scene.meta.timeEvents.onChanged.subscribe(this.handleMetaChanged, false);
  }

  public set(name: string, offset: number, preserve = true) {
    let event = this.lookup.get(name);
    if (!event || event.offset === offset) {
      return;
    }
    this.preserveTiming = preserve;
    event = {
      ...event,
      targetTime: event.initialTime + offset,
      offset,
    };
    this.lookup.set(name, event);
    this.registeredEvents.set(name, event);
    this.events.current = [...this.registeredEvents.values()];
    this.didEventsChange = true;
    this.scene.reload();
  }

  public register(name: string, initialTime: number): number {
    if (this.collisionLookup.has(name)) {
      this.scene.logger.error({
        message: `name "${name}" has already been used for another event name.`,
        stack: new Error().stack,
      });
      return 0;
    }

    this.collisionLookup.add(name);
    let event = this.lookup.get(name);
    if (!event) {
      this.didEventsChange = true;
      event = {
        name,
        initialTime,
        targetTime: initialTime,
        offset: 0,
        stack: new Error().stack,
      };
      this.lookup.set(name, event);
    } else {
      let changed = false;
      const newEvent = {...event};

      const stack = new Error().stack;
      if (newEvent.stack !== stack) {
        newEvent.stack = stack;
        changed = true;
      }

      if (newEvent.initialTime !== initialTime) {
        newEvent.initialTime = initialTime;
        changed = true;
      }

      const offset = Math.max(0, newEvent.targetTime - newEvent.initialTime);
      if (this.preserveTiming && newEvent.offset !== offset) {
        newEvent.offset = offset;
        changed = true;
      }

      const target = newEvent.initialTime + newEvent.offset;
      if (!this.preserveTiming && newEvent.targetTime !== target) {
        this.didEventsChange = true;
        newEvent.targetTime = target;
        changed = true;
      }

      if (changed) {
        event = newEvent;
        this.lookup.set(name, event);
      }
    }

    this.registeredEvents.set(name, event);

    return event.offset;
  }

  /**
   * Called when the parent scene gets reloaded.
   */
  private handleReload = () => {
    this.registeredEvents.clear();
    this.collisionLookup.clear();
  };

  /**
   * Called when the parent scene gets recalculated.
   */
  private handleRecalculated = () => {
    this.preserveTiming = true;
    this.events.current = [...this.registeredEvents.values()];

    if (
      this.didEventsChange ||
      (this.previousReference?.length ?? 0) !== this.events.current.length
    ) {
      this.didEventsChange = false;
      this.previousReference = [...this.registeredEvents.values()].map(
        event => ({
          name: event.name,
          targetTime: event.targetTime,
        }),
      );
      this.scene.meta.timeEvents.set(this.previousReference);
    }
  };

  private handleReset = () => {
    this.collisionLookup.clear();
  };

  /**
   * Called when the meta of the parent scene changes.
   */
  private handleMetaChanged = (data: SerializedTimeEvent[]) => {
    // Ignore the event if `timeEvents` hasn't changed.
    // This may happen when another part of metadata has changed triggering
    // this event.
    if (data === this.previousReference) return;
    this.previousReference = data;
    this.load(data);
    this.scene.reload();
  };

  private load(events: SerializedTimeEvent[]) {
    for (const event of events) {
      const previous = this.lookup.get(event.name) ?? {
        name: event.name,
        initialTime: 0,
        offset: 0,
      };

      this.lookup.set(event.name, {
        ...previous,
        targetTime: event.targetTime,
      });
    }
  }
}
