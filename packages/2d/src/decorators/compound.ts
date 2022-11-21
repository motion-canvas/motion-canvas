import {SignalValue, isReactive} from '@motion-canvas/core/lib/utils';
import {capitalize, getPropertyMeta} from './property';

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
 */
export function compound(
  mapping: string[] | Record<string, string>,
): PropertyDecorator {
  return (target: any, key) => {
    const meta = getPropertyMeta<any>(target, key);
    if (!meta) {
      console.error(`Missing property decorator for "${key.toString()}"`);
      return;
    }

    const entries = Array.isArray(mapping)
      ? mapping.map(key => [key, key])
      : Object.entries(mapping);

    meta.compound = true;
    meta.clone = false;
    for (const [, property] of entries) {
      const propertyMeta = getPropertyMeta<any>(target, property);
      if (!propertyMeta) {
        console.error(
          `Missing property decorator for "${property.toString()}"`,
        );
        return;
      }
      propertyMeta.compoundParent = key.toString();
    }

    target.constructor.prototype[`get${capitalize(key.toString())}`] =
      function () {
        const object = Object.fromEntries(
          entries.map(([key, property]) => [key, this[property]()]),
        );
        return meta?.wrapper ? new meta.wrapper(object) : object;
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
  };
}
