import {
  capitalize,
  deepLerp,
  InterpolationFunction,
  SignalContext,
  SignalValue,
  TimingFunction,
  useLogger,
} from '@motion-canvas/core';
import {makeSignalExtensions} from '../utils/makeSignalExtensions';
import {addInitializer, initialize} from './initializers';

export interface PropertyMetadata<T> {
  default?: T;
  interpolationFunction?: InterpolationFunction<T>;
  parser?: (value: any) => T;
  getter?: () => T;
  setter?: (value: any) => void;
  tweener?: (
    value: T,
    duration: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<T>,
  ) => void;
  cloneable?: boolean;
  inspectable?: boolean;
  compoundParent?: string;
  compound?: boolean;
  compoundEntries: [string, string][];
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

export function initializeSignals(instance: any, props: Record<string, any>) {
  initialize(instance);
  for (const [key, meta] of Object.entries(getPropertiesOf(instance))) {
    const signal = instance[key];
    signal.reset();
    if (props[key] !== undefined) {
      signal(props[key]);
    }
    if (meta.compoundEntries !== undefined) {
      for (const [key, property] of meta.compoundEntries) {
        if (property in props) {
          signal[key](props[property]);
        }
      }
    }
  }
}

/**
 * Create a signal decorator.
 *
 * @remarks
 * This decorator turns the given property into a signal.
 *
 * The class using this decorator can implement the following methods:
 * - `get[PropertyName]` - A property getter.
 * - `get[PropertyName]` - A property setter.
 * - `tween[PropertyName]` - A tween provider.
 *
 * @example
 * ```ts
 * class Example {
 *   \@property()
 *   public declare length: Signal<number, this>;
 * }
 * ```
 */
export function signal<T>(): PropertyDecorator {
  return (target: any, key) => {
    // FIXME property metadata is not inherited
    // Consider retrieving it inside the initializer using the instance and not
    // the class.
    const meta = getPropertyMetaOrCreate<T>(target, key);
    addInitializer(target, (instance: any) => {
      let initial: SignalValue<T> = meta.default!;
      const defaultMethod = instance[`getDefault${capitalize(key as string)}`];
      if (defaultMethod) {
        initial = () => defaultMethod.call(instance, meta.default);
      }

      const signal = new SignalContext<T, T, any>(
        initial,
        meta.interpolationFunction ?? deepLerp,
        instance,
        meta.parser?.bind(instance),
        makeSignalExtensions(meta, instance, <string>key),
      );
      instance[key] = signal.toSignal();
    });
  };
}

/**
 * Create an initial signal value decorator.
 *
 * @remarks
 * This decorator specifies the initial value of a property.
 *
 * Must be specified before the {@link signal} decorator.
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
 * Create a signal interpolation function decorator.
 *
 * @remarks
 * This decorator specifies the interpolation function of a property.
 * The interpolation function is used when tweening between different values.
 *
 * Must be specified before the {@link signal} decorator.
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
 * Create a signal parser decorator.
 *
 * @remarks
 * This decorator specifies the parser of a property.
 * Instead of returning the raw value, its passed as the first parameter to the
 * parser and the resulting value is returned.
 *
 * If the wrapper class has a method called `lerp` it will be set as the
 * default interpolation function for the property.
 *
 * Must be specified before the {@link signal} decorator.
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
 * Create a signal wrapper decorator.
 *
 * @remarks
 * This is a shortcut decorator for setting both the {@link parser} and
 * {@link interpolation}.
 *
 * The interpolation function will be set only if the wrapper class has a method
 * called `lerp`, which will be used as said function.
 *
 * Must be specified before the {@link signal} decorator.
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
 * Must be specified before the {@link signal} decorator.
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
 * Must be specified before the {@link signal} decorator.
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
