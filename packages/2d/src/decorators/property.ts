import {InterpolationFunction, map} from '@motion-canvas/core/lib/tweening';
import {useSignal} from '@motion-canvas/core/lib/utils';
import {addInitializer} from './initializers';

export function property<T>(
  initial?: T,
  mapper?: InterpolationFunction<T>,
): PropertyDecorator {
  return (target: any, key) => {
    addInitializer(target, (instance: any, context: any) => {
      instance[key] = useSignal(
        context.defaults[key] ?? initial,
        mapper ?? map,
        instance,
      );
    });
  };
}
