import {PossibleVector2, Vector2} from '../types';
import {MetaField} from './MetaField';

export type Vector2MetaFieldConstructorParameters = {
  /**
   * A 2D tuple representing the minimum value
   * (inclusive) for each element of the the vector.
   *
   * Defaults to [-Infinity, -Infinity].
   *
   * This constitutes an invariant of the vector
   * and attempts to change its value will be
   * validated against it, which will trigger
   * an exception if validation fails.
   */
  min?: [number, number];

  /**
   * A 2D tuple representing the maximum value
   * (inclusive) for each element of the the vector.
   *
   * Defaults to [Infinity, Infinity].
   *
   * This constitutes an invariant of the vector
   * and attempts to change its value will be
   * validated against it, which will trigger
   * an exception if validation fails.
   */
  max?: [number, number];
};

/**
 * Represents a two-dimensional vector stored in a meta file.
 */
export class Vector2MetaField extends MetaField<PossibleVector2, Vector2> {
  public readonly type = Vector2.symbol;

  public readonly min;
  public readonly max;

  public constructor(
    name: string,
    initial: Vector2,
    {max: argMax, min: argMin}: Vector2MetaFieldConstructorParameters = {},
  ) {
    const min = argMin ?? [-Infinity, -Infinity];
    const max = argMax ?? [Infinity, Infinity];

    Vector2MetaField.validateBoundsParameters(min, max);

    Vector2MetaField.validateAgainstBounds(min, max, initial);

    super(name, initial);

    this.min = min;
    this.max = max;
  }

  public override parse(value: PossibleVector2): Vector2 {
    Vector2MetaField.validateAgainstBounds(this.min, this.max, value);

    return new Vector2(value);
  }

  public override serialize(): PossibleVector2 {
    return this.value.current.serialize();
  }

  private static validateBoundsParameters(
    min: [number, number],
    max: [number, number],
  ): void {
    const [minX, minY] = min;
    const [maxX, maxY] = max;

    if (minX > maxX || minY > maxY) {
      const message = [
        `Vector2MetaField invariant violation!`,
        `Vector bounds (min and max) must not cross!`,
        `Min -> [${minX}, ${minY}]`,
        `Max -> [${maxX}, ${maxY}]`,
      ].join('\n');

      throw new Error(message);
    }
  }

  private static validateAgainstBounds(
    min: [number, number],
    max: [number, number],
    value: PossibleVector2,
  ): void {
    const vector = new Vector2(value);

    const [minX, minY] = min;
    const [maxX, maxY] = max;
    const [x, y] = [vector.x, vector.y];

    if (x < minX || y < minY || x > maxX || y > maxY) {
      const message = [
        `Vector2MetaField invariant violation!`,
        `You're trying to construct/set this field to a value that is out of bounds!`,
        `Value -> [${x}, ${y}]`,
        `Min -> [${minX}, ${minY}]`,
        `Max -> [${maxX}, ${maxY}]`,
      ].join('\n');

      throw new Error(message);
    }
  }
}
