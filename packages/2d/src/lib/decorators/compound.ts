import {
  CompoundSignalContext,
  SignalContext,
  deepLerp,
  map,
  modify,
  useLogger,
} from '@motion-canvas/core';
import {makeSignalExtensions} from '../utils/makeSignalExtensions';
import {addInitializer} from './initializers';
import {getPropertyMetaOrCreate} from './signal';

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
export function compound<
  TSetterValue,
  TValue extends TSetterValue,
  TKeys extends keyof TValue = keyof TValue,
  TOwner = void,
>(
  entries: Record<string, string>,
  klass: typeof CompoundSignalContext<
    TSetterValue,
    TValue,
    TKeys,
    TOwner
  > = CompoundSignalContext,
): PropertyDecorator {
  return (target, key) => {
    const meta = getPropertyMetaOrCreate<any>(target, key);
    meta.compound = true;
    meta.compoundEntries = Object.entries(entries);

    addInitializer(target, (instance: any) => {
      if (!meta.parser) {
        useLogger().error(`Missing parser decorator for "${key.toString()}"`);
        return;
      }

      const initial = meta.default;
      const parser = meta.parser.bind(instance);
      const signalContext = new klass(
        meta.compoundEntries.map(([key, property]) => {
          const signal = new SignalContext(
            modify(initial, value => parser(value)[key]),
            <any>map,
            instance,
            undefined,
            makeSignalExtensions(undefined, instance, property),
          ).toSignal();
          return [key as TKeys, signal];
        }),
        parser,
        initial,
        meta.interpolationFunction ?? deepLerp,
        instance,
        makeSignalExtensions(meta, instance, <string>key),
      );

      instance[key] = signalContext.toSignal();
    });
  };
}
