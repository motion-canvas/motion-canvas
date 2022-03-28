import {Factory} from 'konva/lib/Factory';
import {Util} from 'konva/lib/Util';
import {tween} from '../animations';
import {Spacing} from '../types';

function addSetter(constructor: Function, attr: string, after: () => void) {
  const method = `set${Util._capitalize(attr)}`;
  if (!constructor.prototype[method]) {
    overWriteSetter(constructor, attr, after);
  }
}

function overWriteSetter(
  constructor: Function,
  attr: string,
  after?: () => void,
) {
  const setter = `set${Util._capitalize(attr)}`;
  const getter = `get${Util._capitalize(attr)}`;
  constructor.prototype[setter] = function (val: any, time?: any) {
    if (time !== undefined) {
      const from = this[getter]();
      let mapper = 'linear';
      if (typeof val === 'string') {
        if (val.startsWith('#') || val.startsWith('rgb')) {
          mapper = 'color';
        } else {
          mapper = 'text';
        }
      } else if (typeof val === 'object') {
        if ('x' in val) {
          if ('width' in val) {
            mapper = 'rectArc';
          }
          mapper = 'vector2d';
        } else if (val instanceof Spacing) {
          mapper = 'spacing';
        }
      }

      return tween(time, value => {
        // @ts-ignore
        this._setAttr(attr, value[mapper](from, val, value.easeInOutCubic()));
        after?.call(this);
      });
    }

    this._setAttr(attr, val);
    after?.call(this);

    return this;
  };
}

function addOverloadedGetterSetter(constructor: Function, attr: string) {
  const capitalizedAttr = Util._capitalize(attr);
  const setter = 'set' + capitalizedAttr;
  const getter = 'get' + capitalizedAttr;

  constructor.prototype[attr] = function (...args: any[]) {
    if (args.length) {
      return this[setter](...args);
    }
    return this[getter]();
  };
}

export function getset(
  defaultValue?: any,
  after?: () => void,
): PropertyDecorator {
  return function (target, propertyKey) {
    Factory.addGetter(target.constructor, propertyKey, defaultValue);
    addSetter(target.constructor, <string>propertyKey, after);
    addOverloadedGetterSetter(target.constructor, <string>propertyKey);
  };
}

export interface AnimatedGetSet<Type, This> {
  (): Type;
  (value: Type): This;
  (value: Type, time: number): Generator;
}
