/**
 * Represents a time event stored in a meta file.
 */
export interface SerializedTimeEvent {
  /**
   * {@inheritDoc TimeEvent.name}
   */
  name: string;
  /**
   * {@inheritDoc TimeEvent.targetTime}
   */
  targetTime: number;
}
