import {deprecate} from '../utils';

/**
 * Create a deprecated decorator that marks methods as deprecated.
 */
export function deprecated(remarks?: string): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const name = target.constructor.name
      ? `${target.constructor.name}.${<string>propertyKey}`
      : <string>propertyKey;
    const message = `${name}() has been deprecated.`;

    if (descriptor.value) {
      descriptor.value = deprecate(descriptor.value, message, remarks);
    }
    if (descriptor.get) {
      descriptor.get = deprecate(descriptor.get, message, remarks);
    }
    if (descriptor.set) {
      descriptor.set = deprecate(descriptor.set, message, remarks);
    }

    return descriptor;
  };
}
