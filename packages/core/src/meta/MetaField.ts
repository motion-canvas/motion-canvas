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
   * @param name - The name of this field displayed in the editor.
   * @param value - The initial value of this field.
   */
  public constructor(public readonly name: string, value: TValue) {
    this.value = new ValueDispatcher(value);
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
}
