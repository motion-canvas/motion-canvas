import {clamp} from '../tweening';
import {PossibleVector2, Vector2} from '../types';
import {MetaField} from './MetaField';

/**
 * Represents a two-dimensional vector stored in a meta file.
 */
export class Vector2MetaField extends MetaField<PossibleVector2, Vector2> {
  public readonly type = Vector2.symbol;

  public constructor(
    public readonly name: string,
    public readonly initial: Vector2,
  ) {
    super(name, initial);

    this.lowerBounds = [-Infinity, -Infinity];
    this.upperBounds = [Infinity, Infinity];
  }

  public override parse(value: PossibleVector2): Vector2 {
    return Vector2MetaField.coerceAgainstBounds(
      this.lowerBounds,
      this.upperBounds,
      value,
    );
  }

  public override serialize(): PossibleVector2 {
    return this.value.current.serialize();
  }

  public min(lowerBounds: [number, number]): Vector2MetaField {
    Vector2MetaField.validateBoundsParameters(lowerBounds, this.upperBounds);

    this.lowerBounds = lowerBounds;

    // When changing the upper bounds
    // we need to re-set the value
    // so that it conforms to the updated bounds
    this.set(
      Vector2MetaField.coerceAgainstBounds(
        this.lowerBounds,
        this.upperBounds,
        this.get(),
      ),
    );

    return this;
  }

  public max(upperBounds: [number, number]): Vector2MetaField {
    Vector2MetaField.validateBoundsParameters(this.lowerBounds, upperBounds);

    this.upperBounds = upperBounds;

    // When changing the upper bounds
    // we need to re-set the value
    // so that it conforms to the updated bounds
    this.set(
      Vector2MetaField.coerceAgainstBounds(
        this.lowerBounds,
        this.upperBounds,
        this.get(),
      ),
    );

    return this;
  }

  /**
   * A 2D tuple representing the minimum value
   * (inclusive) for each element of the the vector.
   *
   * Defaults to [-Infinity, -Infinity].
   */
  public getMin(): [number, number] {
    return this.lowerBounds;
  }

  /**
   * A 2D tuple representing the maximum value
   * (inclusive) for each element of the the vector.
   *
   * Defaults to [Infinity, Infinity].
   */
  public getMax(): [number, number] {
    return this.upperBounds;
  }

  public override clone(): this {
    const vectorClone = new Vector2(this.get().x, this.get().y);

    // I'm not entirely sure what's going on here type-wise
    // that it complains about the return type
    return new Vector2MetaField(this.name, vectorClone)
      .min(this.getMin())
      .max(this.getMax()) as MetaField<PossibleVector2, Vector2> as any;
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

  private static coerceAgainstBounds(
    min: [number, number],
    max: [number, number],
    value: PossibleVector2,
  ): Vector2 {
    const vector = new Vector2(value);

    const [minX, minY] = min;
    const [maxX, maxY] = max;
    const [originalX, originalY] = [vector.x, vector.y];

    const coercedX = clamp(minX, maxX, originalX);
    const coercedY = clamp(minY, maxY, originalY);

    vector.x = coercedX;
    vector.y = coercedY;

    return vector;
  }

  private lowerBounds: [number, number];

  private upperBounds: [number, number];
}
