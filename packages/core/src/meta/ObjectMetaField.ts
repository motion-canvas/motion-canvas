import {ValueDispatcher} from '../events';
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

class ObjectMetaFieldInternal<
  T extends Record<string, MetaField<any>>,
> extends MetaField<ValueOf<T>> {
  public readonly type = Object;

  /**
   * Triggered when the nested fields change.
   *
   * @eventProperty
   */
  public get onFieldsChanged() {
    return this.event.subscribable;
  }

  protected ignoreChange = false;
  protected customFields: Record<string, unknown> = {};
  protected readonly fields: Map<string, MetaField<unknown>>;
  protected readonly event: ValueDispatcher<MetaField<unknown>[]>;

  public constructor(name: string, fields: T) {
    const map = new Map(Object.entries(fields));
    super(
      name,
      Object.fromEntries(
        Array.from(map, ([name, field]) => [name, field.get()]),
      ) as ValueOf<T>,
    );

    this.event = new ValueDispatcher([...map.values()]);
    this.fields = map;
    for (const [key, field] of this.fields) {
      Object.defineProperty(this, key, {value: field});
      field.onChanged.subscribe(this.handleChange);
    }
  }

  public override set(value: Partial<ValueOf<T>>) {
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
    return {
      ...this.transform('serialize'),
      ...this.customFields,
    };
  }

  public override clone(): this {
    const cloned = new (<any>this.constructor)(
      this.name,
      this.transform('clone'),
    );
    cloned.set(structuredClone(this.customFields));

    return cloned;
  }

  protected handleChange = () => {
    if (this.ignoreChange) return;
    this.value.current = {
      ...this.transform('get'),
      ...this.customFields,
    };
  };

  protected transform<TKey extends CallableKeys<MetaField<any>>>(
    fn: TKey,
  ): TransformationOf<T, TKey> {
    const transformed = Object.fromEntries(
      Array.from(this.fields, ([name, field]) => [name, field[fn]()]),
    ) as TransformationOf<T, TKey>;

    return transformed;
  }
}

/**
 * Represents an object with nested meta-fields.
 */
export type ObjectMetaField<T extends Record<string, MetaField<any>>> =
  ObjectMetaFieldInternal<T> & T;

/**
 * Represents an object with nested meta-fields.
 */
export const ObjectMetaField = ObjectMetaFieldInternal as {
  new <T extends Record<string, MetaField<any>>>(
    name: string,
    data: T,
  ): ObjectMetaField<T>;
};
