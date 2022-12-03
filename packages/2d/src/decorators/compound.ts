import {
  SignalValue,
  isReactive,
  useLogger,
} from '@motion-canvas/core/lib/utils';
import {
  capitalize,
  createProperty,
  getPropertyMetaOrCreate,
  Property,
} from './property';
import {addInitializer} from './initializers';
import {deepLerp} from '@motion-canvas/core/lib/tweening';

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

    addInitializer(target, (instance: any, context: any) => {
      if (!meta.parser) {
        useLogger().error(`Missing parser decorator for "${key.toString()}"`);
        return;
      }
      const parser = meta.parser;
      const initial = context.defaults[key] ?? meta.default;
      const initialWrapped: SignalValue<any> = isReactive(initial)
        ? () => parser(initial())
        : parser(initial);

      const signals: [string, Property<any, any, any>][] = [];
      for (const [key, property] of meta.compoundEntries) {
        signals.push([
          key,
          createProperty(
            instance,
            property,
            context.defaults[property] ??
              (isReactive(initialWrapped)
                ? () => initialWrapped()[key]
                : initialWrapped[key]),
            undefined,
            undefined,
            instance[`get${capitalize(<string>property)}`],
            instance[`set${capitalize(<string>property)}`],
            instance[`tween${capitalize(<string>property)}`],
          ),
        ]);
      }

      function getter() {
        const object = Object.fromEntries(
          signals.map(([key, property]) => [key, property()]),
        );
        return parser(object);
      }

      function setter(value: SignalValue<any>) {
        if (isReactive(value)) {
          for (const [key, property] of signals) {
            property(() => value()[key]);
          }
        } else {
          for (const [key, property] of signals) {
            property(value[key]);
          }
        }
      }

      const property = createProperty(
        instance,
        <string>key,
        undefined,
        meta.interpolationFunction ?? deepLerp,
        parser,
        getter,
        setter,
        instance[`tween${capitalize(<string>key)}`],
      );

      for (const [key, signal] of signals) {
        Object.defineProperty(property, key, {value: signal});
      }

      Object.defineProperty(property, 'reset', {
        value: () => {
          for (const [, signal] of signals) {
            signal.reset();
          }
          return instance;
        },
      });

      Object.defineProperty(property, 'save', {
        value: () => {
          for (const [, signal] of signals) {
            signal.save();
          }
          return instance;
        },
      });

      instance[key] = property;
    });
  };
}
