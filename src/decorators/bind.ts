export function bind(): MethodDecorator {
  return <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void => {
    const name = `__binded${propertyKey.toString()}`;
    const fn = <Function>(<unknown>descriptor.value);

    return {
      get() {
        this[name] ??= fn.bind(this);
        return this[name];
      },
    };
  };
}
