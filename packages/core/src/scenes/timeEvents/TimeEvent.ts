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
   * @remarks
   * In other words, the moment at which {@link flow.waitUntil} for this event
   * was invoked.
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
  /**
   * Stack trace at the moment of registration.
   */
  stack?: string;
}
