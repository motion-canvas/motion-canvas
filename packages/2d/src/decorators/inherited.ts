import {deepLerp} from '@motion-canvas/core/lib/tweening';
import {capitalize} from '@motion-canvas/core/lib/utils';
import {InheritedSignalContext} from '@motion-canvas/core/lib/signals';
import {patchSignal} from '../utils/patchSignal';
import {addInitializer} from './initializers';
import {getPropertyMetaOrCreate} from './signal';

export function inherited<T>(): PropertyDecorator {
  return (target, key) => {
    const meta = getPropertyMetaOrCreate<T>(target, key);
    addInitializer(target, (instance: any, context: any) => {
      const signal = new InheritedSignalContext<T, T, any>(
        context.defaults[key] ?? null,
        meta.interpolationFunction ?? deepLerp,
        instance,
      );
      patchSignal(signal, meta.parser, instance, <string>key);
      const computeFunction =
        instance?.[`compute${capitalize(<string>key)}`].bind(instance);
      signal.setCompute(computeFunction);
      if (!(key in context.defaults)) {
        signal.setInitial(computeFunction);
        // the undefined `initial` in the `super()` call above cached `undefined` internally,
        // we need to reset `event` to clear the cache here
        signal.get();
        signal.reset();
      }
      instance[key] = signal.toSignal();
    });
  };
}
