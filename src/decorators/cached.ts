import type {Node} from 'konva/lib/Node';

export function cached(key: string): MethodDecorator {
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (this: Node) {
      return this._getCache(key, original);
    };
    descriptor.value.prototype.cachedKey = key;
    return descriptor;
  };
}
