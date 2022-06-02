import type {Node} from 'konva/lib/Node';
import {Factory} from 'konva/lib/Factory';
import {ANIMATE} from '../symbols';
import {
  Animator,
  InterpolationFunction,
  TweenFunction,
  TweenProvider,
} from '../tweening';
import {ThreadGenerator} from '../threading';
import {Vector2d} from 'konva/lib/types';

declare module 'konva/lib/types' {
  export interface GetSet<Type, This extends Node> {
    (): Type;
    (value: Type): This;
    (value: typeof ANIMATE): Animator<Type, This>;
    <Rest extends any[]>(
      value: Type,
      time: number,
      interpolation?: InterpolationFunction,
      mapper?: TweenFunction<Type, Rest>,
      ...rest: Rest
    ): ThreadGenerator;
  }
}

Factory.addOverloadedGetterSetter = function addOverloadedGetterSetter(
  constructor: Function,
  attr: string,
  tween?: TweenProvider<any>,
) {
  const capitalizedAttr = attr.charAt(0).toUpperCase() + attr.slice(1);
  const setter = 'set' + capitalizedAttr;
  const getter = 'get' + capitalizedAttr;

  constructor.prototype[attr] = function <Rest extends any[]>(
    value?: Vector2d | typeof ANIMATE,
    time?: number,
    interpolation?: InterpolationFunction,
    mapper?: TweenFunction<any, Rest>,
    ...rest: Rest
  ) {
    if (value === ANIMATE) {
      return new Animator<any, Node>(this, attr, tween);
    }
    if (time !== undefined) {
      return new Animator<any, Node>(this, attr, tween)
        .key(value, time, interpolation, mapper, ...rest)
        .run();
    }
    return value === undefined ? this[getter]() : this[setter](value);
  };
};
