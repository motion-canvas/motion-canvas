import {PossibleVector2, Vector2} from '../types';
import {MetaField} from './MetaField';

/**
 * Represents a two-dimensional vector stored in a meta file.
 */
export class Vector2MetaField extends MetaField<PossibleVector2, Vector2> {
  public readonly type = Vector2.symbol;

  public override parse(value: PossibleVector2): Vector2 {
    return new Vector2(value);
  }

  public override serialize(): PossibleVector2 {
    return this.value.current.serialize();
  }
}
