import type {NodeConfig} from 'konva/lib/Node';
import type {Shape} from 'konva/lib/Shape';
import type {Reference} from './utils';
import {Container} from 'konva/lib/Container';
import {Surface} from './components';

function isConstructor(fn: Function): fn is new (...args: any[]) => any {
  return !!fn.prototype?.name;
}

type ChildrenConfig = {
  [key in keyof JSX.ElementChildrenAttribute]:
    | JSX.ElementClass
    | JSX.ElementClass[];
};

type ReferenceConfig = {
  ref?: Reference<JSX.ElementClass>;
};

export const Fragment = Symbol.for('Fragment');
export function jsx(
  type:
    | (new (config?: NodeConfig) => JSX.ElementClass)
    | ((config: NodeConfig) => JSX.ElementClass)
    | typeof Fragment,
  config: NodeConfig & ChildrenConfig & ReferenceConfig,
): JSX.ElementClass | JSX.ElementClass[] {
  const {children, ref, ...rest} = config;
  const flatChildren = Array.isArray(children) ? children.flat() : [children];

  if (type === Fragment) {
    return flatChildren;
  }

  if (!isConstructor(type)) {
    return type(config);
  }

  const node = new type(rest);
  if (children) {
    if (node instanceof Surface) {
      node.setChild(<Shape>flatChildren[0]);
    } else if (node instanceof Container) {
      node.add(...flatChildren);
    }
  }

  if (ref) {
    if (Array.isArray(ref)) {
      console.warn('Reference arrays are deprecated. Use makeRef() instead.');
      ref[0][ref[1]] = node;
    } else {
      ref.value = node;
    }
  }

  return node;
}
export {jsx as jsxs};
