import {MetaField} from './MetaField';

export type ValueOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends MetaField<any, infer P> ? P : never;
};

type TransformationOf<
  TObject extends Record<string, any>,
  TKey extends CallableKeys<MetaField<any>>,
> = {
  [K in keyof TObject]: TObject[K] extends MetaField<infer A, infer B>
    ? ReturnType<MetaField<A, B>[TKey]>
    : never;
};

type CallableKeys<T> = {
  [K in keyof T]: T[K] extends () => void ? K : never;
}[keyof T];

/**
 * Represents an object with nested meta-fields.
 */
class ObjectMetaFieldInternal<
  T extends Record<string, MetaField<any>>,
> extends MetaField<ValueOf<T>> {
  public readonly type = Object;

  protected ignoreChange = false;
  protected customFields: Record<string, unknown> = {};
  protected readonly fields: Map<string, MetaField<unknown>>;

  public constructor(name: string, fields: T) {
    const map = new Map(Object.entries(fields));
    super(
      name,
      Object.fromEntries(
        Array.from(map, ([name, field]) => [name, field.get()]),
      ) as ValueOf<T>,
    );

    this.fields = map;
    for (const [key, field] of this.fields) {
      Object.defineProperty(this, key, {value: field});
      field.onChanged.subscribe(this.handleChange);
    }
  }

  public override set(value: ValueOf<T>) {
    this.ignoreChange = true;
    for (const [key, fieldValue] of Object.entries(value)) {
      const field = this.fields.get(key);
      if (field) {
        field.set(fieldValue);
      } else {
        this.customFields[key] = fieldValue;
      }
    }
    this.ignoreChange = false;
    this.handleChange();
  }

  public override serialize(): ValueOf<T> {
    return this.transform('serialize');
  }

  public override clone(): this {
    return new (<any>this.constructor)(this.name, this.transform('clone'));
  }

  protected handleChange = () => {
    if (this.ignoreChange) return;
    this.value.current = this.transform('get');
  };

  protected transform<TKey extends CallableKeys<MetaField<any>>>(
    fn: TKey,
  ): TransformationOf<T, TKey> {
    const transformed = Object.fromEntries(
      Array.from(this.fields, ([name, field]) => [name, field[fn]()]),
    ) as TransformationOf<T, TKey>;

    return {
      ...transformed,
      ...this.customFields,
    };
  }

  public [Symbol.iterator]() {
    return this.fields.values();
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
