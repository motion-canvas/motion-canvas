import {
  deepLerp,
  easeInOutCubic,
  TimingFunction,
  tween,
  InterpolationFunction,
} from '@motion-canvas/core/lib/tweening';
import {addInitializer} from './initializers';
import {
  Signal,
  SignalValue,
  isReactive,
  createSignal,
  SignalGetter,
  SignalSetter,
  SignalTween,
} from '@motion-canvas/core/lib/utils';

export function capitalize<T extends string>(value: T): Capitalize<T> {
  return <Capitalize<T>>(value[0].toUpperCase() + value.slice(1));
}

export type PropertyOwner<TValue> = {
  [key: `get${Capitalize<string>}`]: SignalGetter<TValue> | undefined;
  [key: `set${Capitalize<string>}`]: SignalSetter<TValue> | undefined;
  [key: `tween${Capitalize<string>}`]: SignalTween<TValue> | undefined;
};

export function createProperty<
  TValue,
  TNode extends PropertyOwner<TValue>,
  TProperty extends string & keyof TNode,
>(
  node: TNode,
  property: TProperty,
  initial?: TValue,
  defaultInterpolation: InterpolationFunction<TValue> = deepLerp,
): Signal<TValue, TNode> {
  let getter: () => TValue;
  let setter: (value: SignalValue<TValue>) => void;

  const originalGetter = node[`get${capitalize(property)}`];
  const originalSetter = node[`set${capitalize(property)}`];
  const tweener = node[`tween${capitalize(property)}`];

  if (!originalGetter !== !originalSetter) {
    console.warn(
      `The "${property}" property needs to provide either both the setter and getter or none of them`,
    );
  }

  let signal: Signal<TValue, TNode> | null = null;
  if (!originalGetter || !originalSetter) {
    signal = createSignal(initial, defaultInterpolation, node);
    if (!tweener) {
      return signal;
    }

    getter = signal;
    setter = signal;
  } else {
    getter = originalGetter.bind(node);
    setter = originalSetter.bind(node);
  }

  const handler = <Signal<TValue, TNode>>(
    function (
      newValue?: SignalValue<TValue>,
      duration?: number,
      timingFunction: TimingFunction = easeInOutCubic,
      interpolationFunction: InterpolationFunction<TValue> = defaultInterpolation,
    ) {
      if (newValue === undefined) {
        return getter();
      }

      if (duration === undefined) {
        return setter(newValue);
      }

      if (tweener) {
        return tweener.call(
          node,
          newValue,
          duration,
          timingFunction,
          interpolationFunction,
        );
      }

      const from = getter();
      return tween(duration, value => {
        setter(
          interpolationFunction(
            from,
            isReactive(newValue) ? newValue() : newValue,
            timingFunction(value),
          ),
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

  if (initial !== undefined && originalSetter) {
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
 * - `tween[PropertyName]` - a tween provider.
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
 */
export function property<T>(
  initial?: T,
  interpolationFunction?: InterpolationFunction<T>,
): PropertyDecorator {
  return (target: any, key) => {
    addInitializer(target, (instance: any, context: any) => {
      instance[key] = createProperty(
        instance,
        <string>key,
        context.defaults[key] ?? initial,
        interpolationFunction ?? deepLerp,
      );
    });
  };
}
