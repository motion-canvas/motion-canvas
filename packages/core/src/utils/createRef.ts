export interface ReferenceReceiver<T> {
  (reference: T): void;
}

export interface Reference<T> extends ReferenceReceiver<T> {
  (): T;
}

export function createRef<T>(): Reference<T> {
  let value: T;
  const ref = (newValue?: T) => {
    if (newValue !== undefined) {
      value = newValue;
    } else {
      return value;
    }
  };

  return ref as Reference<T>;
}

export function makeRef<TObject, TKey extends keyof TObject>(
  object: TObject,
  key: TKey,
): ReferenceReceiver<TObject[TKey]> {
  return newValue => {
    object[key] = newValue;
  };
}

export type RefsProperty<TValue> = TValue extends (config: {
  refs?: infer TReference;
}) => void
  ? TReference
  : never;

export function makeRefs<
  T extends (config: {refs?: any}) => void,
>(): RefsProperty<T> {
  return {} as RefsProperty<T>;
}
