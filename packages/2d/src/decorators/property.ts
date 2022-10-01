import {
  deepLerp,
  easeInOutCubic,
  TimingFunction,
  tween,
  InterpolationFunction,
} from '@motion-canvas/core/lib/tweening';
import {addInitializer} from './initializers';
import {
  SignalValue,
  isReactive,
  createSignal,
  SignalGetter,
  SignalSetter,
  SignalTween,
  SignalUtils,
} from '@motion-canvas/core/lib/utils';

export function capitalize<T extends string>(value: T): Capitalize<T> {
  return <Capitalize<T>>(value[0].toUpperCase() + value.slice(1));
}

export interface Property<
  TSetterValue,
  TGetterValue extends TSetterValue,
  TOwner,
> extends SignalGetter<TGetterValue>,
    SignalSetter<TSetterValue>,
    SignalTween<TSetterValue>,
    SignalUtils<TOwner> {}

export type PropertyOwner<TGetterValue, TSetterValue> = {
  [key: `get${Capitalize<string>}`]: SignalGetter<TGetterValue> | undefined;
  [key: `set${Capitalize<string>}`]: SignalSetter<TSetterValue> | undefined;
  [key: `tween${Capitalize<string>}`]: SignalTween<TGetterValue> | undefined;
};

export function createProperty<
  TSetterValue,
  TGetterValue extends TSetterValue,
  TNode extends PropertyOwner<TGetterValue, TSetterValue>,
  TProperty extends string & keyof TNode,
>(
  node: TNode,
  property: TProperty,
  initial?: TSetterValue,
  defaultInterpolation: InterpolationFunction<TGetterValue> = deepLerp,
  klass?: new (value: TSetterValue) => TGetterValue,
): Property<TSetterValue, TGetterValue, TNode> {
  let getter: SignalGetter<TGetterValue>;
  let setter: SignalSetter<TSetterValue>;

  const originalGetter = node[`get${capitalize(property)}`];
  const originalSetter = node[`set${capitalize(property)}`];
  const tweener = node[`tween${capitalize(property)}`];

  if (!originalGetter !== !originalSetter) {
    console.warn(
      `The "${property}" property needs to provide either both the setter and getter or none of them`,
    );
  }

  let wrap: (value: SignalValue<TSetterValue>) => SignalValue<TGetterValue>;
  let unwrap: (value: SignalValue<TSetterValue>) => TGetterValue;
  if (klass) {
    wrap = value =>
      isReactive(value) ? () => new klass(value()) : new klass(value);
    unwrap = value => new klass(isReactive(value) ? value() : value);
  } else {
    wrap = value => <SignalValue<TGetterValue>>value;
    unwrap = value => <TGetterValue>(isReactive(value) ? value() : value);
  }

  let signal: Property<TSetterValue, TGetterValue, TNode> | null = null;
  if (!originalGetter || !originalSetter) {
    signal = <Property<TSetterValue, TGetterValue, TNode>>(
      (<unknown>(
        createSignal(
          initial === undefined ? undefined : wrap(initial),
          defaultInterpolation,
          node,
        )
      ))
    );
    if (!tweener) {
      return signal;
    }

    getter = signal;
    setter = signal;
  } else {
    getter = originalGetter.bind(node);
    setter = (...args) => {
      originalSetter.apply(node, args);
      return node;
    };
  }

  const handler = <Property<TSetterValue, TGetterValue, TNode>>(
    function (
      newValue?: SignalValue<TSetterValue>,
      duration?: number,
      timingFunction: TimingFunction = easeInOutCubic,
      interpolationFunction: InterpolationFunction<TGetterValue> = defaultInterpolation,
    ) {
      if (newValue === undefined) {
        return getter();
      }

      if (duration === undefined) {
        return setter(wrap(newValue));
      }

      if (tweener) {
        return tweener.call(
          node,
          wrap(newValue),
          duration,
          timingFunction,
          interpolationFunction,
        );
      }

      const from = getter();
      return tween(duration, value => {
        setter(
          interpolationFunction(from, unwrap(newValue), timingFunction(value)),
        );
      });
    }
  );

  Object.defineProperty(handler, 'reset', {
    value: signal
      ? () => signal?.reset()
      : initial !== undefined
      ? () => setter(initial)
      : () => node,
  });

  Object.defineProperty(handler, 'save', {
    value: () => setter(getter()),
  });

  if (initial !== undefined && !signal) {
    setter(initial);
  }

  return handler;
}

/**
 * Create a signal property decorator.
 *
 * @remarks
 * This decorator turns the given property into a signal.
 *
 * The class using this decorator can implement the following methods:
 * - `get[PropertyName]` - A property getter.
 * - `get[PropertyName]` - A property setter.
 * - `tween[PropertyName]` - A tween provider.
 *
 * See the {@link PropertyOwner} type for more detailed method signatures.
 *
 * @example
 * ```ts
 * class Example {
 *   \@property()
 *   public declare color: Signal<Color, this>;
 *
 *   \@customProperty()
 *   public declare colorString: Signal<string, this>;
 *
 *   protected getColorString() {
 *     return this.color().toString();
 *   }
 *
 *   protected setColorString(value: SignalValue<string>) {
 *     this.color(
 *       isReactive(value)
 *         ? () => new Color(value())
 *         : new Color(value)
 *     );
 *   }
 * }
 * ```
 *
 * @param initial - An option initial value of the property.
 * @param interpolationFunction - The default function used to interpolate
 *                                between values.
 * @param klass - A class used to instantiate the returned value.
 */
export function property<T>(
  initial?: T,
  interpolationFunction?: InterpolationFunction<T>,
  klass?: new (value: any) => T,
): PropertyDecorator {
  return (target: any, key) => {
    addInitializer(target, (instance: any, context: any) => {
      instance[key] = createProperty(
        instance,
        <string>key,
        context.defaults[key] ?? initial,
        interpolationFunction ?? deepLerp,
        klass,
      );
    });
  };
}
