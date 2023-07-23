import {Reference} from './createRef';

type ProxyTarget<T> = {
  (): void;
  array: T[];
};

export type ReferenceArray<T> = T[] & Reference<T>;

/**
 * Create an array of references.
 *
 * @remarks
 * The returned object is both an array and a reference that can be passed
 * directly to the `ref` property of a node.
 *
 * @example
 * ```tsx
 * const labels = createRefArray<Txt>();
 *
 * view.add(['A', 'B'].map(text => <Txt ref={labels}>{text}</Txt>));
 * view.add(<Txt ref={labels}>C</Txt>);
 *
 * // accessing the references individually:
 * yield* labels[0].text('A changes', 0.3);
 * yield* labels[1].text('B changes', 0.3);
 * yield* labels[2].text('C changes', 0.3);
 *
 * // accessing all references at once:
 * yield* all(...labels.map(label => label.fill('white', 0.3)));
 * ```
 */
export function createRefArray<T>(): ReferenceArray<T> {
  const target = function () {
    // do nothing
  } as ProxyTarget<T>;
  target.array = [];
  return new Proxy(target, Handler) as unknown as ReferenceArray<T>;
}

const Handler: ProxyHandler<ProxyTarget<any>> = {
  apply(target, _, argArray) {
    if (argArray.length === 0) {
      return target.array[0];
    }

    target.array.push(...argArray);
  },

  get(target, property, receiver) {
    const value = Reflect.get(target.array, property, receiver);
    if (typeof value === 'function') {
      return value.bind(target.array);
    }

    return value;
  },

  set(target, property, value, receiver) {
    return Reflect.set(target.array, property, value, receiver);
  },
};
