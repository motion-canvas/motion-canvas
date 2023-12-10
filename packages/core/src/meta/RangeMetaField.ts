import {clamp} from '../tweening';
import {EPSILON} from '../types';
import {MetaField} from './MetaField';

/**
 * Represents a range stored in a meta file.
 *
 * @remarks
 * Range is an array with two elements denoting the beginning and end of a
 * range, respectively.
 */
export class RangeMetaField extends MetaField<
  [number, number | null],
  [number, number]
> {
  public static readonly symbol = Symbol.for(
    '@motion-canvas/core/meta/RangeMetaField',
  );
  public readonly type = RangeMetaField.symbol;

  public override parse(value: [number, number | null]): [number, number] {
    return this.parseRange(Infinity, value[0], value[1] ?? Infinity);
  }

  /**
   * Convert the given range from frames to seconds and update this field.
   *
   * @remarks
   * This helper method applies additional validation to the range, preventing
   * it from overflowing the timeline.
   *
   * @param startFrame - The beginning of the range.
   * @param endFrame - The end of the range.
   * @param duration - The current duration in frames.
   * @param fps - The current framerate.
   */
  public update(
    startFrame: number,
    endFrame: number,
    duration: number,
    fps: number,
  ) {
    this.value.current = this.parseRange(
      duration / fps - EPSILON,
      startFrame / fps - EPSILON,
      endFrame / fps - EPSILON,
    );
  }

  protected parseRange(
    duration: number,
    startFrame: number = this.value.current[0],
    endFrame: number = this.value.current[1],
  ): [number, number] {
    startFrame = clamp(0, duration, startFrame);
    endFrame = clamp(0, duration, endFrame ?? Infinity);

    if (startFrame > endFrame) {
      [startFrame, endFrame] = [endFrame, startFrame];
    }

    if (endFrame >= duration) {
      endFrame = Infinity;
    }

    return [startFrame, endFrame];
  }
}
