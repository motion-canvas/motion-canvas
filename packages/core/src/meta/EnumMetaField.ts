import {MetaField} from './MetaField';
import {MetaOption} from './MetaOption';

/**
 * Represents an enum value stored in a meta file.
 */
export class EnumMetaField<T> extends MetaField<T> {
  public static readonly symbol = Symbol.for(
    '@motion-canvas/core/meta/EnumMetaField',
  );
  public readonly type = EnumMetaField.symbol;

  public constructor(
    name: string,
    public readonly options: MetaOption<T>[],
    initial: T = options[0]?.value,
  ) {
    super(name, initial);
  }

  public set(value: T) {
    super.set(this.getOption(value)?.value);
  }

  public parse(value: T): T {
    return this.getOption(value)?.value;
  }

  public getOption(value: T): MetaOption<T> {
    return (
      this.options.find(option => option.value === value) ?? this.options[0]
    );
  }
}
