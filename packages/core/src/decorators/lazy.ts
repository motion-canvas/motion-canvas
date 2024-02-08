const UNINITIALIZED = Symbol.for(
  '@motion-canvas/core/decorators/UNINITIALIZED',
);

/**
 * Create a lazy decorator.
 *
 * @remarks
 * A property marked as lazy will not be initialized until it's requested for
 * the first time. Lazy properties are read-only.
 *
 * Must be used for any static properties that require the DOM API to be
 * initialized.
 *
 * @param factory - A function that returns the value of this property.
 */
export function lazy(factory: () => unknown): PropertyDecorator {
  return (target, propertyKey) => {
    let value: unknown = UNINITIALIZED;
    Object.defineProperty(target, propertyKey, {
      get(): any {
        if (value === UNINITIALIZED) {
          value = factory.call(this);
        }
        return value;
      },
    });
  };
}
