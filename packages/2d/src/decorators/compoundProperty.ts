import {
  deepLerp,
  easeInOutCubic,
  TimingFunction,
  tween,
  InterpolationFunction,
} from '@motion-canvas/core/lib/tweening';
import {addInitializer} from './initializers';
import {Signal, SignalValue, isReactive} from '@motion-canvas/core/lib/utils';

type SignalRecord<T extends keyof any> = {
  [P in T]: Signal<any, any>;
};

type CompoundValue<T extends keyof any> = {
  [P in T]: any;
};

export function createCompoundProperty<
  TProperties extends keyof TNode,
  TNode extends SignalRecord<TProperties>,
  TValue extends CompoundValue<TProperties> = CompoundValue<TProperties>,
>(
  node: TNode,
  propertyKeys: TProperties[],
  initial?: TValue,
  defaultInterpolation: InterpolationFunction<TValue> = deepLerp,
): Signal<TValue, TNode> {
  const handler = <Signal<TValue, TNode>>(
    function (
      newValue?: SignalValue<TValue>,
      duration?: number,
      timingFunction: TimingFunction = easeInOutCubic,
      interpolationFunction: InterpolationFunction<TValue> = defaultInterpolation,
    ) {
      if (duration !== undefined && newValue !== undefined) {
        const from = <TValue>(
          Object.fromEntries(propertyKeys.map(key => [key, node[key]()]))
        );

        return tween(duration, value => {
          const interpolatedValue = interpolationFunction(
            from,
            isReactive(newValue) ? newValue() : newValue,
            timingFunction(value),
          );
          for (const key of propertyKeys) {
            node[key](interpolatedValue[key]);
          }
        });
      }

      if (newValue !== undefined) {
        if (typeof newValue === 'function') {
          for (const key of propertyKeys) {
            node[key](() => newValue()[key]);
          }
        } else {
          for (const key of propertyKeys) {
            node[key](newValue[key]);
          }
        }
        return node;
      }

      return Object.fromEntries(propertyKeys.map(key => [key, node[key]()]));
    }
  );

  if (initial !== undefined) {
    handler(initial);
  }

  return handler;
}

export function compoundProperty(
  keys: string[],
  mapper?: InterpolationFunction<any>,
): PropertyDecorator {
  return (target: any, key) => {
    addInitializer(target, (instance: any, context: any) => {
      instance[key] = createCompoundProperty(
        instance,
        keys,
        context.defaults[key],
        mapper ?? deepLerp,
      );
    });
  };
}
