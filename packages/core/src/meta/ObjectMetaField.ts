import {MetaField} from './MetaField';

type ValueOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends MetaField<any, infer P> ? P : never;
};

/**
 * Represents an object with nested meta-fields.
 */
class ObjectMetaFieldInternal<
  T extends Record<string, MetaField<any>>,
> extends MetaField<ValueOf<T>> {
  protected ignoreChange = false;

  public constructor(name: string, protected readonly fields: T) {
    const entries = Object.entries(fields);
    super(
      name,
      Object.fromEntries(
        entries.map(([name, field]) => [name, field.get()]),
      ) as ValueOf<T>,
    );

    for (const [key, field] of entries) {
      Object.defineProperty(this, key, {value: field});
      field.onChanged.subscribe(this.handleChange);
    }
  }

  public override set(value: ValueOf<T>) {
    this.ignoreChange = true;
    for (const [key, fieldValue] of Object.entries(value)) {
      this.fields[key]?.set(fieldValue);
    }
    this.ignoreChange = false;
    this.handleChange();
  }

  public override serialize(): ValueOf<T> {
    return Object.fromEntries(
      Object.entries(this.fields).map(([name, field]) => [
        name,
        field.serialize(),
      ]),
    ) as ValueOf<T>;
  }

  protected handleChange = () => {
    if (this.ignoreChange) return;

    this.value.current = Object.fromEntries(
      Object.entries(this.fields).map(([name, field]) => [name, field.get()]),
    ) as ValueOf<T>;
  };

  public override clone(): this {
    return new (<any>this.constructor)(
      this.name,
      Object.fromEntries(
        Object.entries(this.fields).map(([name, field]) => [
          name,
          field.clone(),
        ]),
      ),
    );
  }
}

/**
 * {@inheritDoc ObjectMetaFieldInternal}
 */
export type ObjectMetaField<T extends Record<string, MetaField<any>>> =
  ObjectMetaFieldInternal<T> & T;

/**
 * {@inheritDoc ObjectMetaFieldInternal}
 */
export const ObjectMetaField = ObjectMetaFieldInternal as {
  new <T extends Record<string, MetaField<any>>>(
    name: string,
    data: T,
  ): ObjectMetaField<T>;
};
