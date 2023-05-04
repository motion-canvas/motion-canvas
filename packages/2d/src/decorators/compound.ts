import {useLogger} from '@motion-canvas/core/lib/utils';
import {getPropertyMetaOrCreate} from './signal';
import {addInitializer} from './initializers';
import {deepLerp} from '@motion-canvas/core/lib/tweening';
import {CompoundSignalContext} from '@motion-canvas/core/lib/signals';
import {patchSignal} from '../utils/patchSignal';

/**
 * Create a compound property decorator.
 *
 * @remarks
 * This decorator turns a given property into a signal consisting of one or more
 * nested signals.
 *
 * @example
 * ```ts
 * class Example {
 *   \@compound({x: 'scaleX', y: 'scaleY'})
 *   public declare readonly scale: Signal<Vector2, this>;
 *
 *   public setScale() {
 *     this.scale({x: 7, y: 3});
 *     // same as:
 *     this.scale.x(7).scale.y(3);
 *   }
 * }
 * ```
 *
 * @param entries - A record mapping the property in the compound object to the
 *                  corresponding property on the owner node.
 */
export function compound(entries: Record<string, string>): PropertyDecorator {
  return (target, key) => {
    const meta = getPropertyMetaOrCreate<any>(target, key);
    meta.compound = true;
    meta.compoundEntries = Object.entries(entries);

    addInitializer(target, (instance: any) => {
      if (!meta.parser) {
        useLogger().error(`Missing parser decorator for "${key.toString()}"`);
        return;
      }

      const signalContext = new CompoundSignalContext(
        Object.keys(entries),
        meta.parser,
        meta.default,
        meta.interpolationFunction ?? deepLerp,
        instance,
      );
      patchSignal(signalContext, meta, instance, <string>key);
      const signal = signalContext.toSignal();

      for (const [key, property] of meta.compoundEntries) {
        patchSignal(signal[key].context, undefined, instance, property);
      }

      instance[key] = signal;
    });
  };
}
