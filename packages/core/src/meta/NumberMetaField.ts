import {clamp} from '../tweening';
import {MetaField} from './MetaField';
import {MetaOption} from './MetaOption';

/**
 * Represents a number stored in a meta file.
 */
export class NumberMetaField extends MetaField<any, number> {
  public readonly type = Number;
  protected presets: MetaOption<number>[] = [];
  protected min = -Infinity;
  protected max = Infinity;
  protected precision = 0;
  protected step = 1;

  public parse(value: any): number {
    let parsed = parseFloat(value);
    if (isNaN(parsed)) {
      parsed = this.initial;
    }

    return clamp(this.min, this.max, parsed);
  }

  public getPresets() {
    return this.presets;
  }

  public setPresets(options: MetaOption<number>[]): this {
    this.presets = options;
    return this;
  }

  public setRange(min?: number, max?: number): this {
    this.min = min ?? -Infinity;
    this.max = max ?? Infinity;
    return this;
  }

  public getMin(): number {
    return this.min ?? -Infinity;
  }

  public getMax(): number {
    return this.max ?? Infinity;
  }

  public setPrecision(precision: number): this {
    this.precision = clamp(0, 100, precision);
    return this;
  }

  public getPrecision(): number {
    return this.precision;
  }

  public setStep(step: number): this {
    this.step = step;
    return this;
  }

  public getStep(): number {
    return this.step;
  }
}
