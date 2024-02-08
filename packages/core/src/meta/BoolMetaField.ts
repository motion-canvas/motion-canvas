import {MetaField} from './MetaField';

/**
 * Represents a boolean value stored in a meta file.
 */
export class BoolMetaField extends MetaField<any, boolean> {
  public readonly type = Boolean;

  public parse(value: any): boolean {
    return !!value;
  }
}
