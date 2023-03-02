import type {Scene} from '../Scene';
import type {TimeEvents} from './TimeEvents';
import type {TimeEvent} from './TimeEvent';
import type {SerializedTimeEvent} from './SerializedTimeEvent';
import {ValueDispatcher} from '../../events';
import {useThread} from '../../utils';

/**
 * Manages time events during editing.
 */
export class EditableTimeEvents implements TimeEvents {
  public get onChanged() {
    return this.events.subscribable;
  }
  private readonly events = new ValueDispatcher<TimeEvent[]>([]);

  private registeredEvents: Record<string, TimeEvent> = {};
  private lookup: Record<string, TimeEvent> = {};
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
    this.events.current = Object.values(this.registeredEvents);
    this.didEventsChange = true;
    this.scene.reload();
  }

  public register(name: string): number {
    if (this.collisionLookup.has(name)) {
      this.scene.logger.error({
        message: `name "${name}" has already been used for another event name.`,
        stack: new Error().stack,
      });
      return 0;
    }

    this.collisionLookup.add(name);

    const initialTime = useThread().time();
    if (!this.lookup[name]) {
      this.didEventsChange = true;
      this.lookup[name] = {
        name,
        initialTime,
        targetTime: initialTime,
        offset: 0,
        stack: new Error().stack,
      };
    } else {
      let changed = false;
      const event = {...this.lookup[name]};

      const stack = new Error().stack;
      if (event.stack !== stack) {
        event.stack = stack;
        changed = true;
      }

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
        this.didEventsChange = true;
        event.targetTime = target;
        changed = true;
      }

      if (changed) {
        this.lookup[name] = event;
      }
    }

    this.registeredEvents[name] = this.lookup[name];

    return this.lookup[name].offset;
  }

  /**
   * Called when the parent scene gets reloaded.
   */
  private handleReload = () => {
    this.registeredEvents = {};
    this.collisionLookup.clear();
  };

  /**
   * Called when the parent scene gets recalculated.
   */
  private handleRecalculated = () => {
    this.preserveTiming = true;
    this.events.current = Object.values(this.registeredEvents);

    if (
      this.didEventsChange ||
      (this.previousReference?.length ?? 0) !== this.events.current.length
    ) {
      this.didEventsChange = false;
      this.previousReference = Object.values(this.registeredEvents).map(
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
