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

export interface PropertyMetadata<T> {
  default?: T;
  interpolationFunction?: InterpolationFunction<T>;
  wrapper?: new (value: any) => T;
  clone?: boolean;
  compoundParent?: string;
  compound?: boolean;
}

export interface Property<
  TSetterValue,
  TGetterValue extends TSetterValue,
  TOwner,
> extends SignalGetter<TGetterValue>,
    SignalSetter<TSetterValue>,
    SignalTween<TSetterValue>,
    SignalUtils<TSetterValue, TOwner> {}

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
      return tween(
        duration,
        value => {
          setter(
            interpolationFunction(
              from,
              unwrap(newValue),
              timingFunction(value),
            ),
          );
        },
        () => setter(wrap(newValue)),
      );
    }
  );

  Object.defineProperty(handler, 'reset', {
    value: signal
      ? signal.reset
      : initial !== undefined
      ? () => setter(wrap(initial))
      : () => node,
  });

  Object.defineProperty(handler, 'save', {
    value: () => setter(getter()),
  });

  Object.defineProperty(handler, 'raw', {
    value: signal?.raw ?? getter,
  });

  if (initial !== undefined && !signal) {
    setter(wrap(initial));
  }

  return handler;
}

const PROPERTIES = Symbol.for('properties');

export function getPropertyMeta<T>(
  object: any,
  key: string | symbol,
): PropertyMetadata<T> | null {
  return object[PROPERTIES]?.[key] ?? null;
}

export function getPropertiesOf(
  value: any,
): Record<string, PropertyMetadata<any>> {
  if (value && typeof value === 'object') {
    return value[PROPERTIES] ?? {};
  }

  return {};
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
 *   public declare length: Signal<number, this>;
 * }
 * ```
 */
export function property<T>(): PropertyDecorator {
  return (target: any, key) => {
    let lookup: Record<string | symbol, PropertyMetadata<T>>;
    if (!target[PROPERTIES]) {
      target[PROPERTIES] = lookup = {};
    } else if (
      target[PROPERTIES] &&
      !Object.prototype.hasOwnProperty.call(target, PROPERTIES)
    ) {
      target[PROPERTIES] = lookup = Object.fromEntries<PropertyMetadata<T>>(
        Object.entries(
          <Record<string | symbol, PropertyMetadata<T>>>target[PROPERTIES],
        ).map(([key, meta]) => [key, {...meta}]),
      );
    } else {
      lookup = target[PROPERTIES];
    }

    const meta = (lookup[key] = lookup[key] ?? {clone: true});
    addInitializer(target, (instance: any, context: any) => {
      instance[key] = createProperty(
        instance,
        <string>key,
        context.defaults[key] ?? meta.default,
        meta.interpolationFunction ?? deepLerp,
        meta.wrapper,
      );
    });
  };
}

/**
 * Create an initial property value decorator.
 *
 * @remarks
 * This decorator specifies the initial value of a property.
 *
 * Must be specified before the {@link property} decorator.
 *
 * @example
 * ```ts
 * class Example {
 *   \@initial(1)
 *   \@property()
 *   public declare length: Signal<number, this>;
 * }
 * ```
 *
 * @param value - The initial value of the property.
 */
export function initial<T>(value: T): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMeta<T>(target, key);
    if (!meta) {
      console.error(`Missing property decorator for "${key.toString()}"`);
      return;
    }
    meta.default = value;
  };
}

/**
 * Create a property interpolation function decorator.
 *
 * @remarks
 * This decorator specifies the interpolation function of a property.
 * The interpolation function is used when tweening between different values.
 *
 * Must be specified before the {@link property} decorator.
 *
 * @example
 * ```ts
 * class Example {
 *   \@interpolation(textLerp)
 *   \@property()
 *   public declare text: Signal<string, this>;
 * }
 * ```
 *
 * @param value - The interpolation function for the property.
 */
export function interpolation<T>(
  value: InterpolationFunction<T>,
): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMeta<T>(target, key);
    if (!meta) {
      console.error(`Missing property decorator for "${key.toString()}"`);
      return;
    }
    meta.interpolationFunction = value;
  };
}

/**
 * Create a property wrapper decorator.
 *
 * @remarks
 * This decorator specifies the wrapper of a property.
 * Instead of returning the raw value, an instance of the wrapper is returned.
 * The actual value is passed as the first parameter to the constructor.
 *
 * If the wrapper class has a method called `lerp` it will be set as the
 * default interpolation function for the property.
 *
 * Must be specified before the {@link property} decorator.
 *
 * @example
 * ```ts
 * class Example {
 *   \@wrapper(Vector2)
 *   \@property()
 *   public declare offset: Signal<Vector2, this>;
 * }
 * ```
 *
 * @param value - The wrapper class for the property.
 */
export function wrapper<T>(
  value: (new (value: any) => T) & {lerp?: InterpolationFunction<T>},
): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMeta<T>(target, key);
    if (!meta) {
      console.error(`Missing property decorator for "${key.toString()}"`);
      return;
    }
    meta.wrapper = value;
    if ('lerp' in value) {
      meta.interpolationFunction ??= value.lerp;
    }
  };
}

/**
 * Create a cloning property decorator.
 *
 * @remarks
 * This decorator specifies whether the property should be copied over when
 * cloning the node.
 *
 * By default, any property is copied.
 *
 * Must be specified before the {@link property} decorator.
 *
 * @example
 * ```ts
 * class Example {
 *   \@wrapper(Vector2)
 *   \@property()
 *   public declare offset: Signal<Vector2, this>;
 * }
 * ```
 *
 * @param value - Whether the property should be cloned.
 */
export function clone<T>(value = true): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMeta<T>(target, key);
    if (!meta) {
      console.error(`Missing property decorator for "${key.toString()}"`);
      return;
    }
    meta.clone = value;
  };
}
