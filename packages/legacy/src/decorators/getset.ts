import {Factory} from 'konva/lib/Factory';
import {TweenProvider} from '@motion-canvas/core/lib/tweening';

export function getset<T = unknown>(
  defaultValue?: T,
  after?: Callback,
  tween?: TweenProvider<T>,
): PropertyDecorator {
  return function (target, propertyKey) {
    Factory.addGetter(target.constructor, propertyKey, defaultValue);
    Factory.addSetter(target.constructor, propertyKey, undefined, after);
    // @ts-ignore
    Factory.addOverloadedGetterSetter(target.constructor, propertyKey, tween);
  };
}
