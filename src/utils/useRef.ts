export type Reference<TValue> = TValue extends (config: {
  ref: infer TReference;
}) => void
  ? TReference
  : {value: TValue};

export function useRef<T>(): Reference<T> {
  return {} as Reference<T>;
}

export function makeRef<TObject, TKey extends keyof TObject>(
  object: TObject,
  key: TKey,
): Reference<TObject[TKey]> {
  return {
    get value(): TObject[TKey] {
      return object[key];
    },
    set value(value: TObject[TKey]) {
      object[key] = value;
    },
  } as Reference<TObject[TKey]>;
}
