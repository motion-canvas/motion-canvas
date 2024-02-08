import type {SubscribableValueEvent} from '../../events';
import type {TimeEvent} from './TimeEvent';

/**
 * An interface for classes managing the time events.
 */
export interface TimeEvents {
  /**
   * Triggered when time events change.
   *
   * @eventProperty
   */
  get onChanged(): SubscribableValueEvent<TimeEvent[]>;
  /**
   * Change the time offset of the given event.
   *
   * @param name - The name of the event.
   * @param offset - The time offset in seconds.
   * @param preserve - Whether the timing of the consecutive events should be
   *                   preserved. When set to `true` their offsets will be
   *                   adjusted to keep them in place.
   */
  set(name: string, offset: number, preserve?: boolean): void;
  /**
   * Register a time event.
   *
   * @param name - The name of the event.
   * @param initialTime - Time in seconds, relative to the beginning of the
   *                      scene, at which the event was registered.
   *
   * @returns The duration of the event in seconds.
   *
   * @internal
   */
  register(name: string, initialTime: number): number;
}
