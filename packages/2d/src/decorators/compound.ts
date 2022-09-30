import {SignalValue, isReactive} from '@motion-canvas/core/lib/utils';
import {capitalize} from './property';
import {addInitializer} from './initializers';

/**
 * Create a compound property decorator.
 *
 * @remarks
 * This decorator generates a getter and setter for a compound property.
 * These methods can then be used by the {@link property} decorator to create
 * a signal that acts as a shortcut for accessing multiple other signals.
 *
 * Both the getter and setter operate on an object whose properties correspond
 * to individual signals.
 * For example, `\@property(['x', 'y'])` will operate on an object of type
 * `{x: number, y: number}`. Here, the `x` property can retrieve or set the
 * value of the `this.x` signal.
 *
 * @example
 * ```ts
 * class Example {
 *   \@property(1)
 *   public declare readonly scaleX: Signal<number, this>;
 *
 *   \@property(1)
 *   public declare readonly scaleY: Signal<number, this>;
 *
 *   \@compound({x: 'scaleX', y: 'scaleY'})
 *   \@property(undefined, vector2dLerp)
 *   public declare readonly scale: Signal<Vector2, this>;
 *
 *   public setScale() {
 *     this.scale({x: 7, y: 3});
 *     // same as:
 *     this.scaleX(7).scaleY(3);
 *   }
 * }
 * ```
 *
 * @param mapping - An array of signals to turn into a compound property or a
 *                  record mapping the property in the compound object to the
 *                  corresponding signal.
 *
 * @param klass - A class used to instantiate the returned value.
 */
export function compound(
  mapping: string[] | Record<string, string>,
  klass?: new (from: any) => any,
): PropertyDecorator {
  return (target: any, key) => {
    const entries = Array.isArray(mapping)
      ? mapping.map(key => [key, key])
      : Object.entries(mapping);

    target.constructor.prototype[`get${capitalize(key.toString())}`] =
      function () {
        const object = Object.fromEntries(
          entries.map(([key, property]) => [key, this[property]()]),
        );
        return klass ? new klass(object) : object;
      };

    target.constructor.prototype[`set${capitalize(key.toString())}`] =
      function set(value: SignalValue<any>) {
        if (isReactive(value)) {
          for (const [key, property] of entries) {
            this[property](() => value()[key]);
          }
        } else {
          for (const [key, property] of entries) {
            this[property](value[key]);
          }
        }
      };

    addInitializer(target, (instance: any, context: any) => {
      if (key in context.defaults) {
        instance[key](context.defaults[key]);
      }
    });
  };
}
