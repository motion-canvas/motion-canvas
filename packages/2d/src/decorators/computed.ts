import {addInitializer} from './initializers';
import {createComputed} from '@motion-canvas/core/lib/utils/createComputed';

/**
 * Create a computed method decorator.
 *
 * @remarks
 * This decorator turns the given method into a computed value.
 * See {@link createComputed} for more information.
 */
export function computed(): MethodDecorator {
  return (target: any, key) => {
    const method = target[key];
    addInitializer(target, (instance: any) => {
      instance[key] = createComputed(method.bind(instance));
    });
  };
}
