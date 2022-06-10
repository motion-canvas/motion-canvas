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

declare module 'konva/lib/Factory' {
  export interface Factory {
    addOverloadedGetterSetter(
      constructor: new (...args: unknown[]) => unknown,
      attr: string,
      tween?: TweenProvider<unknown>,
    ): void;
  }
}

declare module 'konva/lib/types' {
  export interface GetSet<Type, This extends Node> {
    (): Type;
    (value: Type): This;
    (value: typeof ANIMATE): Animator<Type, This>;
    <Rest extends unknown[]>(
      value: Type,
      time: number,
      interpolation?: InterpolationFunction,
      mapper?: TweenFunction<Type, Rest>,
      ...rest: Rest
    ): ThreadGenerator;
  }
}

Factory.addOverloadedGetterSetter = function addOverloadedGetterSetter(
  constructor: new (...args: unknown[]) => unknown,
  attr: string,
  tween?: TweenProvider<unknown>,
) {
  const capitalizedAttr = attr.charAt(0).toUpperCase() + attr.slice(1);
  const setter = 'set' + capitalizedAttr;
  const getter = 'get' + capitalizedAttr;

  constructor.prototype[attr] = function <Rest extends unknown[]>(
    value?: Vector2d | typeof ANIMATE,
    time?: number,
    interpolation?: InterpolationFunction,
    mapper?: TweenFunction<unknown, Rest>,
    ...rest: Rest
  ) {
    if (value === ANIMATE) {
      return new Animator<unknown, Node>(this, attr, tween);
    }
    if (time !== undefined) {
      return new Animator<unknown, Node>(this, attr, tween)
        .key(value, time, interpolation, mapper, ...rest)
        .run();
    }
    return value === undefined ? this[getter]() : this[setter](value);
  };
};
