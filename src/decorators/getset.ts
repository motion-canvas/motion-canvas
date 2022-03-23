import {Factory} from "konva/lib/Factory";

export function getset(defaultValue?: any, after?: () => void): PropertyDecorator {
  return function (target, propertyKey) {
    Factory.addGetterSetter(target.constructor, propertyKey, defaultValue, after);
  };
}