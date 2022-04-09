import {Factory} from 'konva/lib/Factory';
import {TweenProvider} from '../tweening';

export function getset(
  defaultValue?: any,
  after?: () => void,
  tween?: TweenProvider<any>,
): PropertyDecorator {
  return function (target, propertyKey) {
    Factory.addGetterSetter(
      target.constructor,
      propertyKey,
      defaultValue,
      tween,
      after,
    );
  };
}
