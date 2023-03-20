import {MetaField} from './MetaField';
import {MetaOption} from './MetaOption';

/**
 * Represents a number stored in a meta file.
 */
export class NumberMetaField extends MetaField<any, number> {
  public readonly type = Number;
  protected presets: MetaOption<number>[] = [];

  public parse(value: any): number {
    return parseFloat(value);
  }

  public getPresets() {
    return this.presets;
  }

  public setPresets(options: MetaOption<number>[]): this {
    this.presets = options;
    return this;
  }
}
