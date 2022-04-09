import {Factory} from 'konva/lib/Factory';
import {TweenProvider} from '../tweening';

export function getset(
  defaultValue?: any,
  after?: () => void,
  tween?: TweenProvider<any>,
): PropertyDecorator {
  return function (target, propertyKey) {
    Factory.addGetter(target.constructor, propertyKey, defaultValue);
    Factory.addSetter(target.constructor, propertyKey, undefined, after);
    // @ts-ignore
    Factory.addOverloadedGetterSetter(target.constructor, propertyKey, tween);
  };
}
