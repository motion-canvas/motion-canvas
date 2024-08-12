import {MetaField} from './MetaField';
import {MetaOption} from './MetaOption';

/**
 * Represents a number stored in a meta file.
 */
export class NumberMetaField extends MetaField<any, number> {
  public readonly type = Number;
  protected presets: MetaOption<number>[] = [];
  protected min?: number;
  protected max?: number;

  public parse(value: any): number {
    let parsed = parseFloat(value);
    if (this.min !== undefined && parsed < this.min) {
      parsed = this.min;
    }
    if (this.max !== undefined && parsed > this.max) {
      parsed = this.max;
    }

    return parsed;
  }

  public getPresets() {
    return this.presets;
  }

  public setPresets(options: MetaOption<number>[]): this {
    this.presets = options;
    return this;
  }

  public setRange(min?: number, max?: number): this {
    this.min = min;
    this.max = max;
    return this;
  }

  public getMin(): number {
    return this.min ?? -Infinity;
  }

  public getMax(): number {
    return this.max ?? Infinity;
  }
}
