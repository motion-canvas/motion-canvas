import {deprecate} from './deprecate';

export interface ReferenceReceiver<T> {
  (reference: T): void;
}

export interface Reference<T> extends ReferenceReceiver<T> {
  (): T;

  /**
   * @deprecated Invoke the reference instead.
   */
  value: T;
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

  Object.defineProperty(ref, 'value', {
    get: deprecate(
      () => value,
      'get Reference.value has been deprecated.',
      `To retrieve the referenced object, invoke the reference like a function:
      <pre>ref.value; // wrong\nref(); // correct</pre>`,
    ),
    set: deprecate(
      newValue => {
        value = newValue;
      },
      'set Reference.value has been deprecated.',
      `To set the referenced object, pass it to the reference like you would to a function:
      <pre>ref.value = object; // wrong\nref(object); // correct</pre>`,
    ),
  });

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
