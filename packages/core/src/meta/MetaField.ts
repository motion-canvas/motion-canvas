import {ValueDispatcher} from '../events';

/**
 * Represents an entry in the meta file.
 *
 * @typeParam TSerializedValue - The type used to store this field in the meta
 *                               file.
 * @typeParam TValue - The runtime type of this field.
 */
export class MetaField<
  TSerializedValue,
  TValue extends TSerializedValue = TSerializedValue,
> {
  /**
   * The type of this field used by the editor to display the correct input.
   */
  public readonly type: any = undefined;
  public spacing = false;
  public description = '';

  /**
   * Triggered when the data of this field changes.
   *
   * @eventProperty
   */
  public get onChanged() {
    return this.value.subscribable;
  }

  protected readonly value: ValueDispatcher<TValue>;

  /**
   * Triggered when the field becomes disabled or enabled.
   *
   * @eventProperty
   */
  public get onDisabled() {
    return this.disabled.subscribable;
  }

  protected readonly disabled = new ValueDispatcher(false);

  /**
   * @param name - The name of this field displayed in the editor.
   * @param initial - The initial value of this field.
   */
  public constructor(
    public readonly name: string,
    public readonly initial: TValue,
  ) {
    this.value = new ValueDispatcher(initial);
  }

  /**
   * Get the current value.
   */
  public get(): TValue {
    return this.value.current;
  }

  /**
   * Set the current value.
   *
   * @param value - The new value.
   */
  public set(value: TSerializedValue) {
    this.value.current = this.parse(value);
  }

  /**
   * Convert a serialized value into a runtime type.
   *
   * @param value - The serialized value.
   */
  public parse(value: TSerializedValue): TValue {
    return value as TValue;
  }

  /**
   * Serialize the value of this field.
   */
  public serialize(): TSerializedValue {
    return this.value.current;
  }

  /**
   * Create a clone of this field.
   */
  public clone(): this {
    return new (<any>this.constructor)(this.name, this.get());
  }

  /**
   * Disable or enable the field in the editor.
   *
   * @param value - Whether the field should be disabled.
   */
  public disable(value = true): this {
    this.disabled.current = value;
    return this;
  }

  /**
   * Add or remove spacing at the beginning of this field.
   *
   * @param value - Whether to include the spacing.
   */
  public space(value = true): this {
    this.spacing = value;
    return this;
  }

  /**
   * Set the description of this field.
   *
   * @param description - The description.
   */
  public describe(description: string): this {
    this.description = description;
    return this;
  }
}
