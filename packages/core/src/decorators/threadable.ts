export function threadable(customName?: string): MethodDecorator {
  return function (
    _: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value.prototype.name = customName ?? propertyKey;
    descriptor.value.prototype.threadable = true;
  };
}
