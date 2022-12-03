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
  useLogger,
} from '@motion-canvas/core/lib/utils';

export function capitalize<T extends string>(value: T): Capitalize<T> {
  return <Capitalize<T>>(value[0].toUpperCase() + value.slice(1));
}

export interface PropertyMetadata<T> {
  default?: T;
  interpolationFunction?: InterpolationFunction<T>;
  parser?: (value: any) => T;
  cloneable?: boolean;
  inspectable?: boolean;
  compoundParent?: string;
  compound?: boolean;
  compoundEntries: [string, string][];
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
  parser?: (value: TSetterValue) => TGetterValue,
  originalGetter?: SignalGetter<TGetterValue>,
  originalSetter?: SignalSetter<TSetterValue>,
  tweener?: SignalTween<TGetterValue>,
): Property<TSetterValue, TGetterValue, TNode> {
  let getter: SignalGetter<TGetterValue>;
  let setter: SignalSetter<TSetterValue>;

  if (!originalGetter !== !originalSetter) {
    useLogger().warn(
      `The "${property}" property needs to provide either both the setter and getter or none of them`,
    );
  }

  let wrap: (value: SignalValue<TSetterValue>) => SignalValue<TGetterValue>;
  let unwrap: (value: SignalValue<TSetterValue>) => TGetterValue;
  if (parser) {
    wrap = value => (isReactive(value) ? () => parser(value()) : parser(value));
    unwrap = value => parser(isReactive(value) ? value() : value);
  } else {
    wrap = value => <SignalValue<TGetterValue>>value;
    unwrap = value => <TGetterValue>(isReactive(value) ? value() : value);
  }

  let signal: Property<TSetterValue, TGetterValue, TNode> | null = null;
  if (!originalGetter || !originalSetter) {
    signal = <Property<TSetterValue, TGetterValue, TNode>>(
      (<unknown>(
        createSignal(
          wrap(<SignalValue<TSetterValue>>initial),
          defaultInterpolation,
          node,
        )
      ))
    );
    if (!tweener && !parser) {
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
    configurable: true,
    value: signal
      ? signal.reset
      : initial !== undefined
      ? () => setter(wrap(initial))
      : () => node,
  });

  Object.defineProperty(handler, 'save', {
    configurable: true,
    value: () => setter(getter()),
  });

  Object.defineProperty(handler, 'raw', {
    value: signal?.raw ?? getter,
  });

  return handler;
}

const PROPERTIES = Symbol.for('@motion-canvas/2d/decorators/properties');

export function getPropertyMeta<T>(
  object: any,
  key: string | symbol,
): PropertyMetadata<T> | null {
  return object[PROPERTIES]?.[key] ?? null;
}

export function getPropertyMetaOrCreate<T>(
  object: any,
  key: string | symbol,
): PropertyMetadata<T> {
  let lookup: Record<string | symbol, PropertyMetadata<T>>;
  if (!object[PROPERTIES]) {
    object[PROPERTIES] = lookup = {};
  } else if (
    object[PROPERTIES] &&
    !Object.prototype.hasOwnProperty.call(object, PROPERTIES)
  ) {
    object[PROPERTIES] = lookup = Object.fromEntries<PropertyMetadata<T>>(
      Object.entries(
        <Record<string | symbol, PropertyMetadata<T>>>object[PROPERTIES],
      ).map(([key, meta]) => [key, {...meta}]),
    );
  } else {
    lookup = object[PROPERTIES];
  }

  lookup[key] ??= {
    cloneable: true,
    inspectable: true,
    compoundEntries: [],
  };
  return lookup[key];
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
    const meta = getPropertyMetaOrCreate<T>(target, key);
    addInitializer(target, (instance: any, context: any) => {
      instance[key] = createProperty(
        instance,
        <string>key,
        context.defaults[key] ?? meta.default,
        meta.interpolationFunction ?? deepLerp,
        meta.parser,
        instance[`get${capitalize(<string>key)}`],
        instance[`set${capitalize(<string>key)}`],
        instance[`tween${capitalize(<string>key)}`],
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
      useLogger().error(`Missing property decorator for "${key.toString()}"`);
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
      useLogger().error(`Missing property decorator for "${key.toString()}"`);
      return;
    }
    meta.interpolationFunction = value;
  };
}

/**
 * Create a property parser decorator.
 *
 * @remarks
 * This decorator specifies the parser of a property.
 * Instead of returning the raw value, its passed as the first parameter to the
 * parser and the resulting value is returned.
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
export function parser<T>(value: (value: any) => T): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMeta<T>(target, key);
    if (!meta) {
      useLogger().error(`Missing property decorator for "${key.toString()}"`);
      return;
    }
    meta.parser = value;
  };
}

/**
 * Create a property wrapper decorator.
 *
 * @remarks
 * This is a shortcut decorator for setting both the {@link parser} and
 * {@link interpolation}.
 *
 * The interpolation function will be set only if the wrapper class has a method
 * called `lerp`, which will be used as said function.
 *
 * Must be specified before the {@link property} decorator.
 *
 * @example
 * ```ts
 * class Example {
 *   \@wrapper(Vector2)
 *   \@property()
 *   public declare offset: Signal<Vector2, this>;
 *
 *   // same as:
 *   \@parser(value => new Vector2(value))
 *   \@interpolation(Vector2.lerp)
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
      useLogger().error(`Missing property decorator for "${key.toString()}"`);
      return;
    }
    meta.parser = raw => new value(raw);
    if ('lerp' in value) {
      meta.interpolationFunction ??= value.lerp;
    }
  };
}

/**
 * Create a cloneable property decorator.
 *
 * @remarks
 * This decorator specifies whether the property should be copied over when
 * cloning the node.
 *
 * By default, any property is cloneable.
 *
 * Must be specified before the {@link property} decorator.
 *
 * @example
 * ```ts
 * class Example {
 *   \@clone(false)
 *   \@property()
 *   public declare length: Signal<number, this>;
 * }
 * ```
 *
 * @param value - Whether the property should be cloneable.
 */
export function cloneable<T>(value = true): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMeta<T>(target, key);
    if (!meta) {
      useLogger().error(`Missing property decorator for "${key.toString()}"`);
      return;
    }
    meta.cloneable = value;
  };
}

/**
 * Create an inspectable property decorator.
 *
 * @remarks
 * This decorator specifies whether the property should be visible in the
 * inspector.
 *
 * By default, any property is inspectable.
 *
 * Must be specified before the {@link property} decorator.
 *
 * @example
 * ```ts
 * class Example {
 *   \@inspectable(false)
 *   \@property()
 *   public declare hiddenLength: Signal<number, this>;
 * }
 * ```
 *
 * @param value - Whether the property should be inspectable.
 */
export function inspectable<T>(value = true): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMeta<T>(target, key);
    if (!meta) {
      useLogger().error(`Missing property decorator for "${key.toString()}"`);
      return;
    }
    meta.inspectable = value;
  };
}
